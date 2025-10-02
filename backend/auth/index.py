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
            'body': ''
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
                    'body': json.dumps({'error': 'Invalid action'})
                }
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Invalid JSON'})
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': cors_headers,
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': cors_headers,
        'body': json.dumps({'error': 'Method not allowed'})
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

def register_user(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    display_name = data.get('displayName', username).strip()
    
    # Валидация данных
    if not username:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Логин обязателен'})}
    
    username_error = validate_username(username)
    if username_error:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': username_error})}
    
    if not email:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Email обязателен'})}
    
    if not validate_email(email):
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Некорректный email'})}
    
    if not password:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Пароль обязателен'})}
    
    password_error = validate_password(password)
    if password_error:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': password_error})}
    
    # Подключение к базе данных
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': 'Database connection error'})}
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        # Проверка на существующего пользователя
        cur.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
        existing_user = cur.fetchone()
        
        if existing_user:
            cur.close()
            conn.close()
            return {
                'statusCode': 409,
                'headers': headers,
                'body': json.dumps({'error': 'Пользователь с таким логином или email уже существует'})
            }
        
        # Хеширование пароля
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Создание пользователя
        cur.execute("""
            INSERT INTO users (username, email, password_hash, display_name, points, level)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, username, email, display_name, points, level, created_at, is_admin
        """, (username, email, password_hash, display_name, 100, 1))
        
        new_user = cur.fetchone()
        conn.commit()
        
        user_data = {
            'id': new_user[0],
            'username': new_user[1],
            'email': new_user[2],
            'displayName': new_user[3],
            'points': new_user[4],
            'level': new_user[5],
            'createdAt': new_user[6].isoformat(),
            'isAdmin': new_user[7] if len(new_user) > 7 else False
        }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': headers,
            'body': json.dumps({
                'message': 'Регистрация прошла успешно',
                'user': user_data
            })
        }
        
    except psycopg2.Error as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }

def login_user(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    login = data.get('login', '').strip()
    password = data.get('password', '')
    
    if not login or not password:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Логин и пароль обязательны'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': 'Database connection error'})}
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        # Поиск пользователя по username или email
        cur.execute("""
            SELECT id, username, email, password_hash, display_name, points, level, wins, losses, is_admin 
            FROM users 
            WHERE (username = %s OR email = %s) AND is_active = true
        """, (login, login))
        
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        if not user:
            return {
                'statusCode': 401,
                'headers': headers,
                'body': json.dumps({'error': 'Неверный логин или пароль'})
            }
        
        # Проверка пароля
        if not bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):
            return {
                'statusCode': 401,
                'headers': headers,
                'body': json.dumps({'error': 'Неверный логин или пароль'})
            }
        
        user_data = {
            'id': user[0],
            'username': user[1],
            'email': user[2],
            'displayName': user[4],
            'points': user[5],
            'level': user[6],
            'wins': user[7],
            'losses': user[8],
            'isAdmin': user[9] if len(user) > 9 else False
        }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Вход выполнен успешно',
                'user': user_data
            })
        }
        
    except psycopg2.Error as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }