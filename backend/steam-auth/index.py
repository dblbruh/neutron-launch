import json
import os
import re
import urllib.parse
import requests
import psycopg2
from typing import Dict, Any

def handler(event, context):
    """
    Business: Steam OpenID authentication for the gaming site
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
    
    query_params = event.get('queryStringParameters', {}) or {}
    
    if method == 'GET':
        if 'openid.mode' in query_params:
            # Обработка ответа от Steam
            return handle_steam_callback(query_params, cors_headers)
        else:
            # Генерация URL для авторизации Steam
            return generate_steam_login_url(cors_headers)
    
    elif method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', '')
            
            if action == 'verify_steam':
                steam_id = body_data.get('steamId', '')
                return get_steam_user_data(steam_id, cors_headers)
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
    
    return {
        'statusCode': 405,
        'headers': cors_headers,
        'body': json.dumps({'error': 'Method not allowed'})
    }

def generate_steam_login_url(headers: Dict[str, str]) -> Dict[str, Any]:
    """Генерация URL для авторизации через Steam OpenID"""
    
    # URL куда Steam будет возвращать пользователя после авторизации
    return_to = "https://functions.poehali.dev/steam-callback"  # Замените на ваш домен
    realm = "https://functions.poehali.dev"  # Замените на ваш домен
    
    params = {
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.mode': 'checkid_setup',
        'openid.return_to': return_to,
        'openid.realm': realm,
        'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
    }
    
    steam_login_url = 'https://steamcommunity.com/openid/login?' + urllib.parse.urlencode(params)
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'steamLoginUrl': steam_login_url,
            'message': 'Redirect user to this URL for Steam authentication'
        })
    }

def handle_steam_callback(params: Dict[str, str], headers: Dict[str, str]) -> Dict[str, Any]:
    """Обработка ответа от Steam после авторизации"""
    
    if params.get('openid.mode') != 'id_res':
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Steam authentication failed'})
        }
    
    # Верификация подписи Steam
    verification_params = dict(params)
    verification_params['openid.mode'] = 'check_authentication'
    
    try:
        response = requests.post('https://steamcommunity.com/openid/login', 
                               data=verification_params, 
                               timeout=10)
        
        if 'is_valid:true' not in response.text:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Steam authentication verification failed'})
            }
        
        # Извлекаем Steam ID из claimed_id
        claimed_id = params.get('openid.claimed_id', '')
        steam_id_match = re.search(r'https://steamcommunity.com/openid/id/(\d+)', claimed_id)
        
        if not steam_id_match:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Invalid Steam ID'})
            }
        
        steam_id = steam_id_match.group(1)
        
        # Получаем данные пользователя из Steam API
        return get_steam_user_data(steam_id, headers, create_if_not_exists=True)
        
    except requests.RequestException as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Steam API request failed: {str(e)}'})
        }

def get_steam_user_data(steam_id: str, headers: Dict[str, str], create_if_not_exists: bool = False) -> Dict[str, Any]:
    """Получение данных пользователя Steam и создание/обновление в базе"""
    
    steam_api_key = os.environ.get('STEAM_API_KEY')
    if not steam_api_key:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Steam API key not configured'})
        }
    
    try:
        # Получаем данные пользователя из Steam API
        steam_api_url = f'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={steam_api_key}&steamids={steam_id}'
        response = requests.get(steam_api_url, timeout=10)
        steam_data = response.json()
        
        if 'response' not in steam_data or 'players' not in steam_data['response'] or not steam_data['response']['players']:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Steam user not found'})
            }
        
        player = steam_data['response']['players'][0]
        
        # Подключение к базе данных
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'Database connection error'})
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        # Проверяем, существует ли пользователь с таким Steam ID
        cur.execute("SELECT id, username, email, display_name, points, level, wins, losses FROM users WHERE steam_id = %s", (steam_id,))
        existing_user = cur.fetchone()
        
        if existing_user:
            # Обновляем существующего пользователя
            cur.execute("""
                UPDATE users 
                SET display_name = %s, avatar_url = %s, avatar_hash = %s, real_name = %s, updated_at = NOW()
                WHERE steam_id = %s
                RETURNING id, username, email, display_name, points, level, wins, losses
            """, (
                player.get('personaname', ''),
                player.get('avatarfull', ''),
                player.get('avatarhash', ''),
                player.get('realname', ''),
                steam_id
            ))
            
            updated_user = cur.fetchone()
            conn.commit()
            
            user_data = {
                'id': updated_user[0],
                'username': updated_user[1],
                'email': updated_user[2],
                'displayName': updated_user[3],
                'points': updated_user[4],
                'level': updated_user[5],
                'wins': updated_user[6],
                'losses': updated_user[7],
                'steamId': steam_id,
                'avatar': player.get('avatarfull', ''),
                'authProvider': 'steam'
            }
            
        elif create_if_not_exists:
            # Создаем нового пользователя
            username = f"steam_{steam_id}"
            display_name = player.get('personaname', f'Player_{steam_id[-4:]}')
            
            cur.execute("""
                INSERT INTO users (username, email, display_name, steam_id, auth_provider, avatar_url, avatar_hash, real_name, points, level)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, username, email, display_name, points, level, wins, losses
            """, (
                username,
                f"{username}@steam.local",  # Фиктивный email для Steam пользователей
                display_name,
                steam_id,
                'steam',
                player.get('avatarfull', ''),
                player.get('avatarhash', ''),
                player.get('realname', ''),
                100,  # Стартовые баллы
                1     # Стартовый уровень
            ))
            
            new_user = cur.fetchone()
            conn.commit()
            
            user_data = {
                'id': new_user[0],
                'username': new_user[1],
                'email': new_user[2],
                'displayName': new_user[3],
                'points': new_user[4],
                'level': new_user[5],
                'wins': new_user[6] or 0,
                'losses': new_user[7] or 0,
                'steamId': steam_id,
                'avatar': player.get('avatarfull', ''),
                'authProvider': 'steam'
            }
            
        else:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'User not found in database'})
            }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Steam authentication successful',
                'user': user_data,
                'steamProfile': {
                    'personaname': player.get('personaname', ''),
                    'avatar': player.get('avatarfull', ''),
                    'profileurl': player.get('profileurl', ''),
                    'country': player.get('loccountrycode', '')
                }
            })
        }
        
    except requests.RequestException as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Steam API request failed: {str(e)}'})
        }
    except psycopg2.Error as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Unexpected error: {str(e)}'})
        }