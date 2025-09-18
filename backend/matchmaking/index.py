import json
import os
import uuid
import psycopg2
from typing import Dict, Any
import random
from datetime import datetime, timedelta

def handler(event, context):
    """
    Business: Game matchmaking system for finding opponents and managing matches
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    cors_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', '')
            
            if action == 'join_queue':
                return join_matchmaking_queue(body_data, cors_headers)
            elif action == 'leave_queue':
                return leave_matchmaking_queue(body_data, cors_headers)
            elif action == 'check_match':
                return check_match_status(body_data, cors_headers)
            elif action == 'finish_match':
                return finish_match(body_data, cors_headers)
            else:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Invalid action'})
                }
        
        elif method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            user_id = query_params.get('user_id')
            
            if user_id:
                return get_user_queue_status(user_id, cors_headers)
            else:
                return get_queue_stats(cors_headers)
        
        else:
            return {
                'statusCode': 405,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Method not allowed'})
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

def get_db_connection():
    """Получение соединения с базой данных"""
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise Exception('Database connection error')
    return psycopg2.connect(database_url)

def join_matchmaking_queue(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Добавление игрока в очередь поиска"""
    user_id = data.get('userId')
    game_mode = data.get('gameMode', 'classic')
    
    if not user_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'User ID is required'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Получаем рейтинг игрока
        cur.execute("SELECT points, level FROM users WHERE id = %s", (user_id,))
        user_data = cur.fetchone()
        
        if not user_data:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'User not found'})
            }
        
        skill_rating = user_data[0] + (user_data[1] * 100)  # points + level bonus
        
        # Проверяем, не в очереди ли уже игрок
        cur.execute("SELECT id FROM matchmaking_queue WHERE user_id = %s", (user_id,))
        existing = cur.fetchone()
        
        if existing:
            return {
                'statusCode': 409,
                'headers': headers,
                'body': json.dumps({'error': 'Already in queue'})
            }
        
        # Добавляем в очередь
        cur.execute("""
            INSERT INTO matchmaking_queue (user_id, game_mode, skill_rating)
            VALUES (%s, %s, %s)
        """, (user_id, game_mode, skill_rating))
        
        # Ищем подходящего противника
        cur.execute("""
            SELECT mq.user_id, mq.skill_rating, u.username, u.display_name, u.level, u.avatar_url
            FROM matchmaking_queue mq
            JOIN users u ON mq.user_id = u.id
            WHERE mq.game_mode = %s 
            AND mq.user_id != %s
            AND ABS(mq.skill_rating - %s) <= 200
            ORDER BY ABS(mq.skill_rating - %s) ASC, mq.joined_at ASC
            LIMIT 1
        """, (game_mode, user_id, skill_rating, skill_rating))
        
        opponent = cur.fetchone()
        
        if opponent:
            # Создаем матч
            match_id = str(uuid.uuid4())[:8]
            
            cur.execute("""
                INSERT INTO matches (match_id, game_mode, status, player1_id, player2_id)
                VALUES (%s, %s, 'waiting', %s, %s)
                RETURNING id
            """, (match_id, game_mode, user_id, opponent[0]))
            
            match_db_id = cur.fetchone()[0]
            
            # Удаляем обоих игроков из очереди
            cur.execute("DELETE FROM matchmaking_queue WHERE user_id IN (%s, %s)", (user_id, opponent[0]))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'message': 'Match found!',
                    'matchId': match_id,
                    'opponent': {
                        'userId': opponent[0],
                        'username': opponent[2],
                        'displayName': opponent[3],
                        'level': opponent[4],
                        'avatar': opponent[5],
                        'skillRating': opponent[1]
                    },
                    'status': 'match_found'
                })
            }
        else:
            conn.commit()
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'message': 'Added to queue, searching for opponent...',
                    'status': 'searching'
                })
            }
            
    except psycopg2.Error as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
    finally:
        cur.close()
        conn.close()

def leave_matchmaking_queue(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Удаление игрока из очереди поиска"""
    user_id = data.get('userId')
    
    if not user_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'User ID is required'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("DELETE FROM matchmaking_queue WHERE user_id = %s", (user_id,))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'Left queue successfully'})
        }
        
    except psycopg2.Error as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
    finally:
        cur.close()
        conn.close()

def check_match_status(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Проверка статуса матча"""
    match_id = data.get('matchId')
    user_id = data.get('userId')
    
    if not match_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Match ID is required'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT m.id, m.match_id, m.game_mode, m.status, m.player1_id, m.player2_id, 
                   m.winner_id, m.player1_score, m.player2_score, m.created_at,
                   u1.username as p1_username, u1.display_name as p1_display,
                   u2.username as p2_username, u2.display_name as p2_display
            FROM matches m
            JOIN users u1 ON m.player1_id = u1.id
            JOIN users u2 ON m.player2_id = u2.id
            WHERE m.match_id = %s
        """, (match_id,))
        
        match_data = cur.fetchone()
        
        if not match_data:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Match not found'})
            }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'matchId': match_data[1],
                'gameMode': match_data[2],
                'status': match_data[3],
                'players': {
                    'player1': {
                        'id': match_data[4],
                        'username': match_data[10],
                        'displayName': match_data[11],
                        'score': match_data[7]
                    },
                    'player2': {
                        'id': match_data[5],
                        'username': match_data[12],
                        'displayName': match_data[13],
                        'score': match_data[8]
                    }
                },
                'winnerId': match_data[6],
                'createdAt': match_data[9].isoformat() if match_data[9] else None
            })
        }
        
    except psycopg2.Error as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
    finally:
        cur.close()
        conn.close()

def finish_match(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Завершение матча с результатами"""
    match_id = data.get('matchId')
    winner_id = data.get('winnerId')
    player1_score = data.get('player1Score', 0)
    player2_score = data.get('player2Score', 0)
    duration = data.get('duration', 0)
    
    if not match_id or not winner_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Match ID and winner ID are required'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Получаем данные матча
        cur.execute("""
            SELECT id, player1_id, player2_id, status 
            FROM matches 
            WHERE match_id = %s
        """, (match_id,))
        
        match_data = cur.fetchone()
        
        if not match_data:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Match not found'})
            }
        
        if match_data[3] == 'completed':
            return {
                'statusCode': 409,
                'headers': headers,
                'body': json.dumps({'error': 'Match already completed'})
            }
        
        match_db_id, player1_id, player2_id, status = match_data
        loser_id = player2_id if winner_id == player1_id else player1_id
        
        # Рассчитываем очки
        base_points = 10
        winner_points = base_points + (player1_score + player2_score) * 2
        loser_points = max(1, (player1_score + player2_score))  # Минимум 1 очко за участие
        
        # Обновляем матч
        cur.execute("""
            UPDATE matches 
            SET status = 'completed', winner_id = %s, player1_score = %s, 
                player2_score = %s, points_awarded = %s, duration_seconds = %s,
                finished_at = NOW()
            WHERE id = %s
        """, (winner_id, player1_score, player2_score, winner_points, duration, match_db_id))
        
        # Обновляем статистику победителя
        cur.execute("""
            UPDATE users 
            SET wins = wins + 1, points = points + %s
            WHERE id = %s
        """, (winner_points, winner_id))
        
        # Обновляем статистику проигравшего
        cur.execute("""
            UPDATE users 
            SET losses = losses + 1, points = points + %s
            WHERE id = %s
        """, (loser_points, loser_id))
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Match completed successfully',
                'winnerId': winner_id,
                'pointsAwarded': {
                    'winner': winner_points,
                    'loser': loser_points
                }
            })
        }
        
    except psycopg2.Error as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
    finally:
        cur.close()
        conn.close()

def get_user_queue_status(user_id: str, headers: Dict[str, str]) -> Dict[str, Any]:
    """Получение статуса игрока в очереди"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT game_mode, skill_rating, joined_at
            FROM matchmaking_queue
            WHERE user_id = %s
        """, (user_id,))
        
        queue_data = cur.fetchone()
        
        if queue_data:
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'inQueue': True,
                    'gameMode': queue_data[0],
                    'skillRating': queue_data[1],
                    'joinedAt': queue_data[2].isoformat()
                })
            }
        else:
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'inQueue': False})
            }
            
    except psycopg2.Error as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
    finally:
        cur.close()
        conn.close()

def get_queue_stats(headers: Dict[str, str]) -> Dict[str, Any]:
    """Получение общей статистики очереди"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT COUNT(*) FROM matchmaking_queue")
        total_in_queue = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM matches WHERE status = 'in_progress'")
        active_matches = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM matches WHERE status = 'completed' AND DATE(created_at) = CURRENT_DATE")
        matches_today = cur.fetchone()[0]
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'totalInQueue': total_in_queue,
                'activeMatches': active_matches,
                'matchesToday': matches_today
            })
        }
        
    except psycopg2.Error as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
    finally:
        cur.close()
        conn.close()