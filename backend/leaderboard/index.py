import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get leaderboard with top players and recent matches
    Args: event - dict with httpMethod, queryStringParameters (limit, offset)
          context - object with attributes: request_id, function_name
    Returns: HTTP response with leaderboard data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    limit = int(params.get('limit', 50))
    offset = int(params.get('offset', 0))
    
    if limit > 100:
        limit = 100
    
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
            points, level, wins, losses
        FROM users 
        WHERE is_active = true
        ORDER BY points DESC, wins DESC
        LIMIT %s OFFSET %s
    ''', (limit, offset))
    
    players = cursor.fetchall()
    
    cursor.execute('''
        SELECT 
            m.id, m.status, m.winner_id, m.created_at,
            p1.username as player1_username,
            p1.display_name as player1_display_name,
            p2.username as player2_username,
            p2.display_name as player2_display_name
        FROM matches m
        JOIN users p1 ON m.player1_id = p1.id
        JOIN users p2 ON m.player2_id = p2.id
        WHERE m.status = 'completed'
        ORDER BY m.created_at DESC
        LIMIT 10
    ''')
    
    matches = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    players_list: List[Dict[str, Any]] = []
    for player in players:
        total_games = (player['wins'] or 0) + (player['losses'] or 0)
        win_rate = ((player['wins'] or 0) / total_games * 100) if total_games > 0 else 0
        
        players_list.append({
            'id': player['id'],
            'username': player['username'],
            'displayName': player['display_name'] or player['username'],
            'avatarUrl': player['avatar_url'],
            'points': player['points'] or 0,
            'level': player['level'] or 1,
            'wins': player['wins'] or 0,
            'losses': player['losses'] or 0,
            'winRate': round(win_rate, 1)
        })
    
    matches_list: List[Dict[str, Any]] = []
    for match in matches:
        winner_name = ''
        if match['winner_id']:
            if match['winner_id'] == match.get('player1_id'):
                winner_name = match['player1_display_name'] or match['player1_username']
            else:
                winner_name = match['player2_display_name'] or match['player2_username']
        
        matches_list.append({
            'id': match['id'],
            'player1': match['player1_display_name'] or match['player1_username'],
            'player2': match['player2_display_name'] or match['player2_username'],
            'winner': winner_name,
            'status': match['status'],
            'date': match['created_at'].isoformat() if match['created_at'] else None
        })
    
    result = {
        'players': players_list,
        'recentMatches': matches_list,
        'total': len(players_list)
    }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(result),
        'isBase64Encoded': False
    }
