import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: Universal content API - tournaments, news, friends, challenges
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response dict
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    cors_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'tournaments')
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Database connection error'})
        }
    
    try:
        if resource == 'tournaments':
            return handle_tournaments(event, method, database_url, cors_headers)
        elif resource == 'news':
            return handle_news(event, method, database_url, cors_headers)
        elif resource == 'friends':
            return handle_friends(event, method, database_url, cors_headers)
        elif resource == 'challenges':
            return handle_challenges(event, method, database_url, cors_headers)
        elif resource == 'chat':
            return handle_chat(event, method, database_url, cors_headers)
        elif resource == 'user':
            return handle_user(event, method, database_url, cors_headers)
        else:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Invalid resource'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': str(e)})
        }

def handle_tournaments(event, method, database_url, headers):
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        status = params.get('status')
        
        if status:
            cur.execute("""
                SELECT t.*, COUNT(tp.user_id) as participants
                FROM tournaments t
                LEFT JOIN tournament_participants tp ON t.id = tp.tournament_id
                WHERE t.status = %s
                GROUP BY t.id
                ORDER BY t.start_date DESC
            """, (status,))
        else:
            cur.execute("""
                SELECT t.*, COUNT(tp.user_id) as participants
                FROM tournaments t
                LEFT JOIN tournament_participants tp ON t.id = tp.tournament_id
                GROUP BY t.id
                ORDER BY t.start_date DESC
            """)
        
        tournaments = cur.fetchall()
        result = [
            {
                'id': t[0],
                'name': t[1],
                'status': t[2],
                'prize_pool': t[3],
                'max_participants': t[4],
                'start_date': t[5].isoformat() if t[5] else None,
                'format': t[7],
                'participants_count': t[9]
            }
            for t in tournaments
        ]
        
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action', 'create')
        
        if action == 'create':
            cur.execute("""
                INSERT INTO tournaments (name, status, prize_pool, max_participants, start_date, format)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, name, status, prize_pool
            """, (
                body.get('name'),
                'upcoming',
                body.get('prize_pool', 0),
                body.get('max_participants', 16),
                body.get('start_date'),
                body.get('format', 'single-elimination')
            ))
            
            tournament = cur.fetchone()
            conn.commit()
            result = {
                'id': tournament[0],
                'name': tournament[1],
                'status': tournament[2],
                'prize_pool': tournament[3]
            }
            
        elif action == 'register':
            cur.execute("""
                INSERT INTO tournament_participants (tournament_id, user_id)
                VALUES (%s, %s)
                RETURNING id
            """, (body.get('tournament_id'), body.get('user_id')))
            
            conn.commit()
            result = {'message': 'Registered successfully'}
    else:
        result = {'error': 'Method not allowed'}
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200 if method == 'GET' else 201,
        'headers': headers,
        'body': json.dumps(result)
    }

def handle_news(event, method, database_url, headers):
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    # Создаем таблицу если не существует
    cur.execute("""
        CREATE TABLE IF NOT EXISTS news (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(50),
            content TEXT,
            author_id INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    
    if method == 'GET':
        cur.execute("""
            SELECT n.*, u.username, u.display_name
            FROM news n
            LEFT JOIN users u ON n.author_id = u.id
            ORDER BY n.created_at DESC
            LIMIT 50
        """)
        
        news = cur.fetchall()
        result = [
            {
                'id': n[0],
                'title': n[1],
                'category': n[2],
                'content': n[3],
                'author': {
                    'id': n[4],
                    'username': n[6],
                    'displayName': n[7]
                } if n[4] else None,
                'created_at': n[5].isoformat() if n[5] else None
            }
            for n in news
        ]
        
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        cur.execute("""
            INSERT INTO news (title, category, content, author_id)
            VALUES (%s, %s, %s, %s)
            RETURNING id, title, category, created_at
        """, (
            body.get('title'),
            body.get('category', 'update'),
            body.get('content'),
            body.get('author_id')
        ))
        
        news_item = cur.fetchone()
        conn.commit()
        
        result = {
            'id': news_item[0],
            'title': news_item[1],
            'category': news_item[2],
            'created_at': news_item[3].isoformat()
        }
    else:
        result = {'error': 'Method not allowed'}
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200 if method == 'GET' else 201,
        'headers': headers,
        'body': json.dumps(result)
    }

def handle_friends(event, method, database_url, headers):
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    # Создаем таблицу если не существует
    cur.execute("""
        CREATE TABLE IF NOT EXISTS friends (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            friend_id INTEGER REFERENCES users(id),
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, friend_id)
        )
    """)
    conn.commit()
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        user_id = params.get('user_id')
        get_requests = params.get('requests') == 'true'
        
        if not user_id:
            cur.close()
            conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'user_id required'})}
        
        if get_requests:
            # Получить входящие заявки
            cur.execute("""
                SELECT u.id, u.username, u.display_name, u.points, u.level, f.id as request_id, f.created_at
                FROM friends f
                JOIN users u ON f.user_id = u.id
                WHERE f.friend_id = %s AND f.status = 'pending'
                ORDER BY f.created_at DESC
            """, (user_id,))
            
            requests = cur.fetchall()
            result = [{
                'id': r[0], 'username': r[1], 'displayName': r[2],
                'points': r[3], 'level': r[4], 'request_id': r[5],
                'created_at': r[6].isoformat() if r[6] else None
            } for r in requests]
        else:
            # Получить друзей
            cur.execute("""
                SELECT u.id, u.username, u.display_name, u.points, u.level, f.status
                FROM friends f
                JOIN users u ON (f.friend_id = u.id OR f.user_id = u.id)
                WHERE (f.user_id = %s OR f.friend_id = %s) AND u.id != %s AND f.status = 'accepted'
            """, (user_id, user_id, user_id))
            
            friends = cur.fetchall()
            result = [{
                'id': f[0], 'username': f[1], 'displayName': f[2],
                'points': f[3], 'level': f[4],
                'status': 'online' if f[0] % 2 == 0 else 'offline'
            } for f in friends]
        
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action', 'add')
        
        if action == 'add':
            cur.execute("""
                INSERT INTO friends (user_id, friend_id, status)
                VALUES (%s, %s, 'pending')
                RETURNING id
            """, (body.get('user_id'), body.get('friend_id')))
            
            conn.commit()
            result = {'message': 'Friend request sent'}
            
        elif action == 'accept':
            cur.execute("""
                UPDATE friends SET status = 'accepted'
                WHERE id = %s
                RETURNING id
            """, (body.get('request_id'),))
            conn.commit()
            result = {'message': 'Friend request accepted'}
        
        elif action == 'reject':
            cur.execute("DELETE FROM friends WHERE id = %s", (body.get('request_id'),))
            conn.commit()
            result = {'message': 'Friend request rejected'}
    else:
        result = {'error': 'Method not allowed'}
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200 if method == 'GET' else 201,
        'headers': headers,
        'body': json.dumps(result)
    }

def handle_challenges(event, method, database_url, headers):
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    # Создаем таблицу если не существует
    cur.execute("""
        CREATE TABLE IF NOT EXISTS challenges (
            id SERIAL PRIMARY KEY,
            creator_id INTEGER REFERENCES users(id),
            opponent_id INTEGER,
            game_mode VARCHAR(10),
            stake INTEGER DEFAULT 0,
            status VARCHAR(20) DEFAULT 'open',
            winner_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        status = params.get('status', 'open')
        
        cur.execute("""
            SELECT c.*, u1.username as creator_name, u2.username as opponent_name
            FROM challenges c
            LEFT JOIN users u1 ON c.creator_id = u1.id
            LEFT JOIN users u2 ON c.opponent_id = u2.id
            WHERE c.status = %s
            ORDER BY c.created_at DESC
            LIMIT 50
        """, (status,))
        
        challenges = cur.fetchall()
        result = [
            {
                'id': ch[0],
                'creator': {
                    'id': ch[1],
                    'username': ch[8]
                },
                'opponent': {
                    'id': ch[2],
                    'username': ch[9]
                } if ch[2] else None,
                'game_mode': ch[3],
                'stake': ch[4],
                'status': ch[5],
                'created_at': ch[7].isoformat() if ch[7] else None
            }
            for ch in challenges
        ]
        
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action', 'create')
        
        if action == 'create':
            cur.execute("""
                INSERT INTO challenges (creator_id, game_mode, stake, status)
                VALUES (%s, %s, %s, 'open')
                RETURNING id, creator_id, game_mode, stake
            """, (
                body.get('creator_id'),
                body.get('game_mode', '1v1'),
                body.get('stake', 0)
            ))
            
            challenge = cur.fetchone()
            conn.commit()
            
            result = {
                'id': challenge[0],
                'creator_id': challenge[1],
                'game_mode': challenge[2],
                'stake': challenge[3],
                'status': 'open'
            }
            
        elif action == 'accept':
            cur.execute("""
                UPDATE challenges 
                SET opponent_id = %s, status = 'accepted'
                WHERE id = %s
                RETURNING id
            """, (body.get('user_id'), body.get('challenge_id')))
            
            conn.commit()
            result = {'message': 'Challenge accepted'}
    else:
        result = {'error': 'Method not allowed'}
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200 if method == 'GET' else 201,
        'headers': headers,
        'body': json.dumps(result)
    }

def handle_chat(event, method, database_url, headers):
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            sender_id INTEGER REFERENCES users(id),
            receiver_id INTEGER REFERENCES users(id),
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        user_id = params.get('user_id')
        friend_id = params.get('friend_id')
        
        if not user_id:
            cur.close()
            conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'user_id required'})}
        
        if friend_id:
            cur.execute("""
                SELECT m.*, u1.username as sender_username, u2.username as receiver_username
                FROM messages m
                LEFT JOIN users u1 ON m.sender_id = u1.id
                LEFT JOIN users u2 ON m.receiver_id = u2.id
                WHERE (m.sender_id = %s AND m.receiver_id = %s) OR (m.sender_id = %s AND m.receiver_id = %s)
                ORDER BY m.created_at ASC LIMIT 100
            """, (user_id, friend_id, friend_id, user_id))
            
            messages = cur.fetchall()
            result = [{
                'id': msg[0], 'sender_id': msg[1], 'receiver_id': msg[2],
                'message': msg[3], 'is_read': msg[4],
                'created_at': msg[5].isoformat() if msg[5] else None,
                'sender_username': msg[6], 'receiver_username': msg[7]
            } for msg in messages]
        else:
            result = []
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        cur.execute("""
            INSERT INTO messages (sender_id, receiver_id, message)
            VALUES (%s, %s, %s)
            RETURNING id, sender_id, receiver_id, message, created_at
        """, (body.get('sender_id'), body.get('receiver_id'), body.get('message')))
        
        message = cur.fetchone()
        conn.commit()
        result = {'id': message[0], 'sender_id': message[1], 'receiver_id': message[2],
                  'message': message[3], 'created_at': message[4].isoformat()}
    else:
        result = {'error': 'Method not allowed'}
    
    cur.close()
    conn.close()
    return {'statusCode': 200 if method == 'GET' else 201, 'headers': headers, 'body': json.dumps(result)}

def handle_user(event, method, database_url, headers):
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        username = params.get('username')
        search = params.get('search')
        
        if username:
            cur.execute("""
                SELECT id, username, display_name, points, level, wins, losses, created_at
                FROM users WHERE username = %s AND is_active = true
            """, (username,))
            
            user = cur.fetchone()
            if not user:
                cur.close()
                conn.close()
                return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'User not found'})}
            
            total = user[5] + user[6]
            result = {
                'id': user[0], 'username': user[1], 'displayName': user[2],
                'points': user[3], 'level': user[4], 'wins': user[5], 'losses': user[6],
                'winRate': round((user[5] / total * 100) if total > 0 else 0, 1),
                'totalMatches': total, 'memberSince': user[7].isoformat() if user[7] else None
            }
        elif search:
            cur.execute("""
                SELECT id, username, display_name, points, level
                FROM users WHERE (username ILIKE %s OR display_name ILIKE %s) AND is_active = true LIMIT 20
            """, (f'%{search}%', f'%{search}%'))
            
            users = cur.fetchall()
            result = [{'id': u[0], 'username': u[1], 'displayName': u[2], 'points': u[3], 'level': u[4]} for u in users]
        else:
            cur.close()
            conn.close()
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'username or search required'})}
    else:
        result = {'error': 'Method not allowed'}
    
    cur.close()
    conn.close()
    return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result)}