import json
import os
import psycopg2
from typing import Dict, Any

def handler(event, context):
    """
    Business: Get player statistics for the gaming site
    Args: event - dict with httpMethod, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response dict with player stats
    """
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    cors_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    if method == 'GET':
        try:
            database_url = os.environ.get('DATABASE_URL')
            if not database_url:
                return {
                    'statusCode': 500,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Database connection error'})
                }
            
            conn = psycopg2.connect(database_url)
            cur = conn.cursor()
            
            # Получаем общее количество зарегистрированных игроков
            cur.execute("SELECT COUNT(*) FROM users WHERE is_active = true")
            total_players = cur.fetchone()[0]
            
            # Получаем количество игроков с хотя бы одним матчем
            cur.execute("SELECT COUNT(*) FROM users WHERE (wins > 0 OR losses > 0) AND is_active = true")
            active_players = cur.fetchone()[0]
            
            # Получаем общую сумму очков всех игроков
            cur.execute("SELECT COALESCE(SUM(points), 0) FROM users WHERE is_active = true")
            total_points = cur.fetchone()[0]
            
            # Получаем топ игрока по очкам
            cur.execute("""
                SELECT display_name, username, points 
                FROM users 
                WHERE is_active = true 
                ORDER BY points DESC 
                LIMIT 1
            """)
            top_player = cur.fetchone()
            
            cur.close()
            conn.close()
            
            # Симулируем онлайн игроков (30-60% от активных игроков)
            import random
            online_multiplier = random.uniform(0.3, 0.6)
            online_players = max(1, int(active_players * online_multiplier))
            
            stats = {
                'totalPlayers': total_players,
                'activePlayers': active_players,
                'onlinePlayers': online_players,
                'totalPoints': total_points,
                'topPlayer': {
                    'name': top_player[0] if top_player and top_player[0] else (top_player[1] if top_player else None),
                    'points': top_player[2] if top_player else 0
                } if top_player else None
            }
            
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps(stats)
            }
            
        except psycopg2.Error as e:
            return {
                'statusCode': 500,
                'headers': cors_headers,
                'body': json.dumps({'error': f'Database error: {str(e)}'})
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