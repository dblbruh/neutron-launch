import json
import os
import re
import bcrypt
import psycopg2
from typing import Dict, Any

def handler(event, context):
    """
    Business: User registration and authentication for the gaming site
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response dict
    """
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    cors_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'register')
            
            if action == 'register':
                return register_user(body_data, cors_headers)
            elif action == 'login':
                return login_user(body_data, cors_headers)
            else:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Invalid action'}),
                    'isBase64Encoded': False
                }
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Invalid JSON'}),
                'isBase64Encoded': False
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': cors_headers,
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': cors_headers,
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> str:
    if len(password) < 6:
        return "Пароль должен содержать минимум 6 символов"
    return ""

def validate_username(username: str) -> str:
    if len(username) < 3:
        return "Логин должен содержать минимум 3 символа"
    if len(username) > 50:
        return "Логин не должен превышать 50 символов"
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return "Логин может содержать только латинские буквы, цифры и знак подчеркивания"
    return ""

def error_response(message: str, status: int, headers: Dict[str, str]) -> Dict[str, Any]:
    return {
        'statusCode': status,
        'headers': headers,
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }

def register_user(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    display_name = data.get('displayName', username).strip()
    region = data.get('region', '').strip()
    age = data.get('age')
    
    if not username:
        return error_response('Логин обязателен', 400, headers)
    
    username_error = validate_username(username)
    if username_error:
        return error_response(username_error, 400, headers)
    
    if not email:
        return error_response('Email обязателен', 400, headers)
    
    if not validate_email(email):
        return error_response('Некорректный email', 400, headers)
    
    if not password:
        return error_response('Пароль обязателен', 400, headers)
    
    password_error = validate_password(password)
    if password_error:
        return error_response(password_error, 400, headers)
    
    if not region:
        return error_response('Регион обязателен', 400, headers)
    
    if not age or not isinstance(age, int) or age < 13 or age > 100:
        return error_response('Укажите корректный возраст (13-100)', 400, headers)
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return error_response('Database connection error', 500, headers)
    
    try:
        conn = psycopg2.connect(database_url)
        conn.autocommit = True
        cur = conn.cursor()
        
        cur.execute("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS region VARCHAR(100),
            ADD COLUMN IF NOT EXISTS age INTEGER,
            ADD COLUMN IF NOT EXISTS show_age BOOLEAN DEFAULT true,
            ADD COLUMN IF NOT EXISTS avatar_url TEXT
        """)
        
        username_esc = username.replace("'", "''")
        email_esc = email.replace("'", "''")
        cur.execute(f"SELECT id FROM users WHERE username = '{username_esc}' OR email = '{email_esc}'")
        existing_user = cur.fetchone()
        
        if existing_user:
            cur.close()
            conn.close()
            return error_response('Пользователь с таким логином или email уже существует', 409, headers)
        
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        username_esc = username.replace("'", "''")
        email_esc = email.replace("'", "''")
        password_hash_esc = password_hash.replace("'", "''")
        display_name_esc = display_name.replace("'", "''")
        region_esc = region.replace("'", "''")
        
        cur.execute(f"""
            INSERT INTO users (username, email, password_hash, display_name, region, age, show_age, points, level)
            VALUES ('{username_esc}', '{email_esc}', '{password_hash_esc}', '{display_name_esc}', '{region_esc}', {age}, true, 100, 1)
            RETURNING id, username, email, display_name, region, age, show_age, points, level, created_at, is_admin
        """)
        
        new_user = cur.fetchone()
        
        user_data = {
            'id': new_user[0],
            'username': new_user[1],
            'email': new_user[2],
            'displayName': new_user[3],
            'region': new_user[4],
            'age': new_user[5],
            'showAge': new_user[6],
            'points': new_user[7],
            'level': new_user[8],
            'createdAt': new_user[9].isoformat(),
            'isAdmin': new_user[10] if len(new_user) > 10 else False
        }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': headers,
            'body': json.dumps({
                'message': 'Регистрация прошла успешно',
                'user': user_data
            }),
            'isBase64Encoded': False
        }
        
    except psycopg2.Error as e:
        return error_response(f'Database error: {str(e)}', 500, headers)

def login_user(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    login = data.get('login', '').strip()
    password = data.get('password', '')
    
    if not login or not password:
        return error_response('Логин и пароль обязательны', 400, headers)
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return error_response('Database connection error', 500, headers)
    
    try:
        conn = psycopg2.connect(database_url)
        conn.autocommit = True
        cur = conn.cursor()
        
        login_esc = login.replace("'", "''")
        cur.execute(f"""
            SELECT id, username, email, password_hash, display_name, region, age, show_age, 
                   avatar_url, points, level, wins, losses, is_admin 
            FROM users 
            WHERE (username = '{login_esc}' OR email = '{login_esc}') AND is_active = true
        """)
        
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        if not user:
            return error_response('Неверный логин или пароль', 401, headers)
        
        if not bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):
            return error_response('Неверный логин или пароль', 401, headers)
        
        user_data = {
            'id': user[0],
            'username': user[1],
            'email': user[2],
            'displayName': user[4],
            'region': user[5],
            'age': user[6],
            'showAge': user[7],
            'avatarUrl': user[8],
            'points': user[9],
            'level': user[10],
            'wins': user[11],
            'losses': user[12],
            'isAdmin': user[13] if len(user) > 13 else False
        }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Вход выполнен успешно',
                'user': user_data
            }),
            'isBase64Encoded': False
        }
        
    except psycopg2.Error as e:
        return error_response(f'Database error: {str(e)}', 500, headers)