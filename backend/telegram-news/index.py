'''
Business: Автоматическая загрузка новостей из Telegram канала
Args: event с httpMethod (GET для проверки, POST для загрузки новых постов)
Returns: HTTP response со списком загруженных новостей
'''

import json
import os
import psycopg2
import urllib.request
from typing import Dict, Any, List, Optional
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    channel_username = os.environ.get('TELEGRAM_CHANNEL_USERNAME', '')
    
    if not bot_token or not channel_username:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'Telegram bot token or channel username not configured',
                'setup_required': True
            })
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'GET':
            # Проверка подключения к каналу
            channel_info = get_channel_info(bot_token, channel_username)
            
            if channel_info.get('ok'):
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'connected': True,
                        'channel': channel_info.get('result', {}),
                        'message': 'Successfully connected to Telegram channel'
                    })
                }
            else:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'connected': False,
                        'error': channel_info.get('description', 'Failed to connect to channel')
                    })
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'sync')
            
            if action == 'sync':
                # Получить последние посты из канала
                limit = body_data.get('limit', 10)
                posts = get_channel_posts(bot_token, channel_username, limit)
                
                if not posts:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'loaded': 0,
                            'message': 'No new posts found'
                        })
                    }
                
                # Получить ID системного админа для автора новостей
                with conn.cursor() as cur:
                    cur.execute('''
                        SELECT id FROM t_p6171346_neutron_launch.users 
                        WHERE is_admin = true 
                        ORDER BY id ASC 
                        LIMIT 1
                    ''')
                    admin_result = cur.fetchone()
                    admin_id = admin_result[0] if admin_result else 1
                
                # Сохранить новые посты в БД
                loaded_count = 0
                for post in posts:
                    # Проверить, не загружен ли уже этот пост
                    with conn.cursor() as cur:
                        cur.execute('''
                            SELECT id FROM t_p6171346_neutron_launch.news 
                            WHERE title LIKE %s
                            LIMIT 1
                        ''', (f'%{post["id"]}%',))
                        
                        if cur.fetchone():
                            continue  # Пост уже существует
                    
                    # Определить категорию по содержимому
                    category = determine_category(post['text'])
                    
                    # Создать новость
                    with conn.cursor() as cur:
                        cur.execute('''
                            INSERT INTO t_p6171346_neutron_launch.news 
                            (title, content, category, author_id, created_at)
                            VALUES (%s, %s, %s, %s, %s)
                        ''', (
                            post['title'],
                            post['text'],
                            category,
                            admin_id,
                            post['date']
                        ))
                        loaded_count += 1
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'loaded': loaded_count,
                        'total_posts': len(posts),
                        'message': f'Successfully loaded {loaded_count} new posts'
                    })
                }
            
            elif action == 'manual_post':
                # Ручное добавление конкретного поста
                message_id = body_data.get('message_id')
                
                if not message_id:
                    return error_response('message_id required', 400)
                
                post = get_single_post(bot_token, channel_username, message_id)
                
                if not post:
                    return error_response('Post not found', 404)
                
                # Получить админа
                with conn.cursor() as cur:
                    cur.execute('''
                        SELECT id FROM t_p6171346_neutron_launch.users 
                        WHERE is_admin = true 
                        LIMIT 1
                    ''')
                    admin_result = cur.fetchone()
                    admin_id = admin_result[0] if admin_result else 1
                
                category = determine_category(post['text'])
                
                with conn.cursor() as cur:
                    cur.execute('''
                        INSERT INTO t_p6171346_neutron_launch.news 
                        (title, content, category, author_id, created_at)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING id
                    ''', (
                        post['title'],
                        post['text'],
                        category,
                        admin_id,
                        post['date']
                    ))
                    news_id = cur.fetchone()[0]
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'news_id': news_id,
                        'message': 'Post added successfully'
                    })
                }
        
        return error_response('Invalid method', 405)
        
    finally:
        conn.close()


def get_channel_info(bot_token: str, channel_id: str) -> Dict:
    '''
    Получение информации о канале
    '''
    try:
        url = f'https://api.telegram.org/bot{bot_token}/getChat?chat_id={channel_id}'
        
        with urllib.request.urlopen(url, timeout=10) as response:
            return json.loads(response.read().decode('utf-8'))
            
    except Exception as e:
        return {'ok': False, 'description': str(e)}


def get_channel_posts(bot_token: str, channel_id: str, limit: int = 10) -> List[Dict]:
    '''
    Получение последних постов из канала
    '''
    try:
        # Получить обновления канала
        url = f'https://api.telegram.org/bot{bot_token}/getUpdates?limit={limit}'
        
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
        
        if not data.get('ok'):
            return []
        
        posts = []
        for update in data.get('result', []):
            if 'channel_post' in update:
                post = update['channel_post']
                
                text = post.get('text', '')
                if not text:
                    continue
                
                # Создать заголовок из первых слов
                title = text[:100] if len(text) > 100 else text
                if len(text) > 100:
                    title = title.rsplit(' ', 1)[0] + '...'
                
                posts.append({
                    'id': post['message_id'],
                    'title': title,
                    'text': text,
                    'date': datetime.fromtimestamp(post['date']).isoformat()
                })
        
        return posts
        
    except Exception as e:
        print(f"Error getting posts: {e}")
        return []


def get_single_post(bot_token: str, channel_id: str, message_id: int) -> Optional[Dict]:
    '''
    Получение конкретного поста по ID
    '''
    try:
        url = f'https://api.telegram.org/bot{bot_token}/forwardMessage'
        payload = json.dumps({
            'chat_id': channel_id,
            'from_chat_id': channel_id,
            'message_id': message_id
        }).encode('utf-8')
        
        req = urllib.request.Request(
            url,
            data=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
        
        if data.get('ok') and 'result' in data:
            post = data['result']
            text = post.get('text', '')
            
            title = text[:100] if len(text) > 100 else text
            if len(text) > 100:
                title = title.rsplit(' ', 1)[0] + '...'
            
            return {
                'id': post['message_id'],
                'title': title,
                'text': text,
                'date': datetime.fromtimestamp(post['date']).isoformat()
            }
        
        return None
        
    except Exception as e:
        print(f"Error getting single post: {e}")
        return None


def determine_category(text: str) -> str:
    '''
    Определение категории новости по содержимому
    '''
    text_lower = text.lower()
    
    if any(word in text_lower for word in ['турнир', 'чемпионат', 'соревнование', 'tournament']):
        return 'tournament'
    elif any(word in text_lower for word in ['обновление', 'патч', 'update', 'новая версия']):
        return 'update'
    elif any(word in text_lower for word in ['событие', 'event', 'мероприятие']):
        return 'event'
    else:
        return 'announcement'


def error_response(message: str, status_code: int = 400) -> Dict:
    return {
        'statusCode': status_code,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': message})
    }