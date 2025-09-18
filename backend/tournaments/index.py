import json
import os
import uuid
import psycopg2
from typing import Dict, Any
from datetime import datetime, timedelta

def handler(event, context):
    """
    Business: Tournament management system for creating and managing tournaments
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
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            tournament_id = query_params.get('tournament_id')
            
            if tournament_id:
                return get_tournament_details(tournament_id, cors_headers)
            else:
                return get_tournaments_list(cors_headers)
                
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', '')
            
            if action == 'create':
                return create_tournament(body_data, cors_headers)
            elif action == 'join':
                return join_tournament(body_data, cors_headers)
            elif action == 'leave':
                return leave_tournament(body_data, cors_headers)
            elif action == 'start':
                return start_tournament(body_data, cors_headers)
            else:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Invalid action'})
                }
        
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

def get_tournaments_list(headers: Dict[str, str]) -> Dict[str, Any]:
    """Получение списка активных турниров"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT t.id, t.tournament_id, t.name, t.description, t.game_mode, 
                   t.status, t.max_participants, t.entry_fee, t.prize_pool, 
                   t.start_date, t.end_date, t.created_at,
                   COUNT(tp.user_id) as participants_count
            FROM tournaments t
            LEFT JOIN tournament_participants tp ON t.id = tp.tournament_id
            WHERE t.status IN ('upcoming', 'registration', 'active')
            GROUP BY t.id
            ORDER BY t.start_date ASC
        """)
        
        tournaments = []
        for row in cur.fetchall():
            tournaments.append({
                'id': row[1],  # tournament_id
                'name': row[2],
                'description': row[3],
                'gameMode': row[4],
                'status': row[5],
                'maxParticipants': row[6],
                'entryFee': row[7],
                'prizePool': row[8],
                'startDate': row[9].isoformat() if row[9] else None,
                'endDate': row[10].isoformat() if row[10] else None,
                'participantsCount': row[12],
                'createdAt': row[11].isoformat()
            })
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'tournaments': tournaments})
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

def get_tournament_details(tournament_id: str, headers: Dict[str, str]) -> Dict[str, Any]:
    """Получение детальной информации о турнире"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Получаем данные турнира
        cur.execute("""
            SELECT t.id, t.tournament_id, t.name, t.description, t.game_mode, 
                   t.status, t.max_participants, t.entry_fee, t.prize_pool, 
                   t.start_date, t.end_date, t.created_at
            FROM tournaments t
            WHERE t.tournament_id = %s
        """, (tournament_id,))
        
        tournament_data = cur.fetchone()
        if not tournament_data:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Tournament not found'})
            }
        
        # Получаем участников турнира
        cur.execute("""
            SELECT tp.user_id, tp.placement, tp.prize_won, tp.joined_at,
                   u.username, u.display_name, u.level, u.avatar_url, u.points
            FROM tournament_participants tp
            JOIN users u ON tp.user_id = u.id
            WHERE tp.tournament_id = %s
            ORDER BY tp.placement ASC NULLS LAST, tp.joined_at ASC
        """, (tournament_data[0],))
        
        participants = []
        for row in cur.fetchall():
            participants.append({
                'userId': row[0],
                'username': row[4],
                'displayName': row[5],
                'level': row[6],
                'avatar': row[7],
                'points': row[8],
                'placement': row[1],
                'prizeWon': row[2],
                'joinedAt': row[3].isoformat()
            })
        
        tournament = {
            'id': tournament_data[1],  # tournament_id
            'name': tournament_data[2],
            'description': tournament_data[3],
            'gameMode': tournament_data[4],
            'status': tournament_data[5],
            'maxParticipants': tournament_data[6],
            'entryFee': tournament_data[7],
            'prizePool': tournament_data[8],
            'startDate': tournament_data[9].isoformat() if tournament_data[9] else None,
            'endDate': tournament_data[10].isoformat() if tournament_data[10] else None,
            'createdAt': tournament_data[11].isoformat(),
            'participants': participants,
            'participantsCount': len(participants)
        }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'tournament': tournament})
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

def create_tournament(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Создание нового турнира"""
    name = data.get('name', '')
    description = data.get('description', '')
    game_mode = data.get('gameMode', 'classic')
    max_participants = data.get('maxParticipants', 16)
    entry_fee = data.get('entryFee', 0)
    prize_pool = data.get('prizePool', 0)
    start_date_str = data.get('startDate', '')
    
    if not name:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Tournament name is required'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        tournament_id = str(uuid.uuid4())[:8]
        
        # Парсим дату начала турнира
        start_date = None
        if start_date_str:
            try:
                start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
            except ValueError:
                # Если не удалось распарсить, устанавливаем на завтра
                start_date = datetime.now() + timedelta(days=1)
        else:
            start_date = datetime.now() + timedelta(days=1)
        
        end_date = start_date + timedelta(hours=3)  # Турнир длится 3 часа
        
        # Создаем турнир
        cur.execute("""
            INSERT INTO tournaments (tournament_id, name, description, game_mode, 
                                   max_participants, entry_fee, prize_pool, 
                                   start_date, end_date, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (tournament_id, name, description, game_mode, max_participants, 
              entry_fee, prize_pool, start_date, end_date, 'registration'))
        
        tournament_db_id = cur.fetchone()[0]
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': headers,
            'body': json.dumps({
                'message': 'Tournament created successfully',
                'tournamentId': tournament_id,
                'status': 'registration'
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

def join_tournament(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Присоединение игрока к турниру"""
    tournament_id = data.get('tournamentId', '')
    user_id = data.get('userId')
    
    if not tournament_id or not user_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Tournament ID and User ID are required'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Получаем данные турнира
        cur.execute("""
            SELECT id, status, max_participants, entry_fee
            FROM tournaments 
            WHERE tournament_id = %s
        """, (tournament_id,))
        
        tournament_data = cur.fetchone()
        if not tournament_data:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Tournament not found'})
            }
        
        tournament_db_id, status, max_participants, entry_fee = tournament_data
        
        if status != 'registration':
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Tournament registration is closed'})
            }
        
        # Проверяем количество участников
        cur.execute("SELECT COUNT(*) FROM tournament_participants WHERE tournament_id = %s", (tournament_db_id,))
        current_participants = cur.fetchone()[0]
        
        if current_participants >= max_participants:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Tournament is full'})
            }
        
        # Проверяем, не зарегистрирован ли уже игрок
        cur.execute("""
            SELECT id FROM tournament_participants 
            WHERE tournament_id = %s AND user_id = %s
        """, (tournament_db_id, user_id))
        
        if cur.fetchone():
            return {
                'statusCode': 409,
                'headers': headers,
                'body': json.dumps({'error': 'Already registered for this tournament'})
            }
        
        # Проверяем, хватает ли у игрока баллов для входного взноса
        if entry_fee > 0:
            cur.execute("SELECT points FROM users WHERE id = %s", (user_id,))
            user_points = cur.fetchone()
            
            if not user_points or user_points[0] < entry_fee:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Insufficient points for entry fee'})
                }
            
            # Снимаем входной взнос
            cur.execute("""
                UPDATE users SET points = points - %s WHERE id = %s
            """, (entry_fee, user_id))
            
            # Добавляем к призовому фонду
            cur.execute("""
                UPDATE tournaments SET prize_pool = prize_pool + %s WHERE id = %s
            """, (entry_fee, tournament_db_id))
        
        # Регистрируем игрока в турнире
        cur.execute("""
            INSERT INTO tournament_participants (tournament_id, user_id)
            VALUES (%s, %s)
        """, (tournament_db_id, user_id))
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Successfully joined tournament',
                'tournamentId': tournament_id
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

def leave_tournament(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Выход игрока из турнира"""
    tournament_id = data.get('tournamentId', '')
    user_id = data.get('userId')
    
    if not tournament_id or not user_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Tournament ID and User ID are required'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Получаем данные турнира
        cur.execute("""
            SELECT id, status, entry_fee
            FROM tournaments 
            WHERE tournament_id = %s
        """, (tournament_id,))
        
        tournament_data = cur.fetchone()
        if not tournament_data:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Tournament not found'})
            }
        
        tournament_db_id, status, entry_fee = tournament_data
        
        if status not in ['registration', 'upcoming']:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Cannot leave tournament after it has started'})
            }
        
        # Удаляем игрока из турнира
        cur.execute("""
            DELETE FROM tournament_participants 
            WHERE tournament_id = %s AND user_id = %s
        """, (tournament_db_id, user_id))
        
        if cur.rowcount == 0:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Not registered for this tournament'})
            }
        
        # Возвращаем входной взнос
        if entry_fee > 0:
            cur.execute("""
                UPDATE users SET points = points + %s WHERE id = %s
            """, (entry_fee, user_id))
            
            cur.execute("""
                UPDATE tournaments SET prize_pool = prize_pool - %s WHERE id = %s
            """, (entry_fee, tournament_db_id))
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Successfully left tournament',
                'refund': entry_fee if entry_fee > 0 else 0
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

def start_tournament(data: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    """Запуск турнира (для админов)"""
    tournament_id = data.get('tournamentId', '')
    
    if not tournament_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Tournament ID is required'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Обновляем статус турнира
        cur.execute("""
            UPDATE tournaments 
            SET status = 'active', start_date = NOW()
            WHERE tournament_id = %s AND status = 'registration'
        """, (tournament_id,))
        
        if cur.rowcount == 0:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Tournament not found or already started'})
            }
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Tournament started successfully',
                'status': 'active'
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