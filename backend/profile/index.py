import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get user profile with statistics
    Args: event - dict with httpMethod, queryStringParameters (user_id)
          context - object with attributes: request_id, function_name
    Returns: HTTP response with user profile data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    cors_headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    
    if method == 'POST':
        return update_profile_settings(event, context, cors_headers)
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    user_id = params.get('user_id')
    
    if not user_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'user_id parameter is required'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration missing'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute('''
        SELECT 
            id, username, display_name, avatar_url, 
            points, level, wins, losses, created_at
        FROM users 
        WHERE id = %s AND is_active = true
    ''', (user_id,))
    
    user = cursor.fetchone()
    
    if not user:
        cursor.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User not found'}),
            'isBase64Encoded': False
        }
    
    cursor.execute('''
        SELECT 
            COUNT(*) as total_matches
        FROM matches 
        WHERE (player1_id = %s OR player2_id = %s) AND status = 'completed'
    ''', (user_id, user_id))
    
    match_stats = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    total_games = user['wins'] + user['losses']
    win_rate = (user['wins'] / total_games * 100) if total_games > 0 else 0
    kd_ratio = 0
    
    profile_data = {
        'id': user['id'],
        'username': user['username'],
        'displayName': user['display_name'] or user['username'],
        'avatarUrl': user['avatar_url'],
        'points': user['points'] or 0,
        'level': user['level'] or 1,
        'wins': user['wins'] or 0,
        'losses': user['losses'] or 0,
        'winRate': round(win_rate, 1),
        'kdRatio': kd_ratio,
        'totalMatches': match_stats['total_matches'] if match_stats else 0,
        'memberSince': user['created_at'].isoformat() if user['created_at'] else None
    }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(profile_data),
        'isBase64Encoded': False
    }

def update_profile_settings(event: Dict[str, Any], context: Any, headers: Dict[str, str]) -> Dict[str, Any]:
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action != 'update_settings':
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Invalid action'}),
                'isBase64Encoded': False
            }
        
        user_id = body.get('user_id')
        display_name = body.get('display_name', '').strip()
        show_age = body.get('show_age', True)
        avatar_url = body.get('avatar_url', '').strip() or None
        
        if not user_id:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'user_id required'}),
                'isBase64Encoded': False
            }
        
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'Database configuration missing'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE users 
            SET display_name = %s, show_age = %s, avatar_url = %s
            WHERE id = %s AND is_active = true
            RETURNING id
        """, (display_name, show_age, avatar_url, user_id))
        
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'User not found'}),
                'isBase64Encoded': False
            }
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Settings updated successfully',
                'displayName': display_name,
                'showAge': show_age,
                'avatarUrl': avatar_url
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }