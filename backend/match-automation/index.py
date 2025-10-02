'''
Business: Автоматизация матчей - запуск, мониторинг, завершение
Args: event с httpMethod, body (challenge_id, tournament_match_id)
Returns: HTTP response с данными матча и статусом
'''

import json
import os
import psycopg2
from typing import Dict, Any, Optional
from datetime import datetime
import urllib.request

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
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'start_challenge_match':
                challenge_id = body_data.get('challenge_id')
                
                # Получить данные вызова
                with conn.cursor() as cur:
                    cur.execute('''
                        SELECT c.id, c.creator_id, c.opponent_id, c.game_mode, c.stake,
                               u1.username as creator_name, u2.username as opponent_name
                        FROM challenges c
                        JOIN users u1 ON c.creator_id = u1.id
                        JOIN users u2 ON c.opponent_id = u2.id
                        WHERE c.id = %s AND c.status = 'accepted'
                    ''', (challenge_id,))
                    
                    challenge = cur.fetchone()
                    if not challenge:
                        return error_response('Challenge not found or not accepted', 404)
                    
                    challenge_data = {
                        'id': challenge[0],
                        'creator_id': challenge[1],
                        'opponent_id': challenge[2],
                        'game_mode': challenge[3],
                        'stake': challenge[4],
                        'creator_name': challenge[5],
                        'opponent_name': challenge[6]
                    }
                
                # Запустить матч на сервере
                match_result = start_match_on_server(
                    match_id=f"challenge_{challenge_id}",
                    game_mode=challenge_data['game_mode'],
                    team1=[challenge_data['creator_name']],
                    team2=[challenge_data['opponent_name']]
                )
                
                if not match_result.get('success'):
                    return error_response('Failed to start match on server', 500)
                
                # Обновить статус вызова
                with conn.cursor() as cur:
                    cur.execute('''
                        UPDATE challenges 
                        SET status = 'in_progress',
                            server_id = %s,
                            server_host = %s
                        WHERE id = %s
                    ''', (
                        match_result['server']['id'],
                        match_result['server']['host'],
                        challenge_id
                    ))
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'challenge_id': challenge_id,
                        'server': match_result['server'],
                        'connect_command': match_result['server']['connect_command'],
                        'message': 'Match started! Use connect command in CS:GO console'
                    })
                }
            
            elif action == 'complete_match':
                match_id = body_data.get('match_id')
                winner_id = body_data.get('winner_id')
                server_id = body_data.get('server_id')
                
                # Определить тип матча (challenge или tournament)
                if match_id.startswith('challenge_'):
                    challenge_id = int(match_id.replace('challenge_', ''))
                    
                    # Получить данные вызова
                    with conn.cursor() as cur:
                        cur.execute('''
                            SELECT creator_id, opponent_id, stake 
                            FROM challenges 
                            WHERE id = %s
                        ''', (challenge_id,))
                        
                        challenge = cur.fetchone()
                        if not challenge:
                            return error_response('Challenge not found', 404)
                        
                        creator_id, opponent_id, stake = challenge
                        loser_id = opponent_id if winner_id == creator_id else creator_id
                    
                    # Обновить балансы
                    with conn.cursor() as cur:
                        # Победитель получает ставку
                        cur.execute('''
                            UPDATE users 
                            SET points = points + %s 
                            WHERE id = %s
                        ''', (stake, winner_id))
                        
                        # Проигравший теряет ставку
                        cur.execute('''
                            UPDATE users 
                            SET points = points - %s 
                            WHERE id = %s
                        ''', (stake, loser_id))
                        
                        # Обновить статус вызова
                        cur.execute('''
                            UPDATE challenges 
                            SET status = 'completed',
                                winner_id = %s,
                                completed_at = NOW()
                            WHERE id = %s
                        ''', (winner_id, challenge_id))
                        
                        conn.commit()
                    
                    # Завершить матч на сервере
                    end_server_match(server_id, match_id)
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'success': True,
                            'match_id': match_id,
                            'winner_id': winner_id,
                            'stake_transferred': stake
                        })
                    }
            
            elif action == 'get_match_status':
                match_id = body_data.get('match_id')
                
                # Получить статус с сервера
                # В реальности здесь запрос к game-server функции
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'match_id': match_id,
                        'status': 'in_progress',
                        'message': 'Match is running'
                    })
                }
        
        return error_response('Invalid action', 400)
        
    finally:
        conn.close()


def start_match_on_server(match_id: str, game_mode: str, team1: list, team2: list) -> Dict:
    '''
    Запуск матча через game-server функцию
    '''
    game_server_url = os.environ.get('GAME_SERVER_URL', '')
    
    if not game_server_url:
        # Если сервер не настроен, возвращаем тестовые данные
        return {
            'success': True,
            'server': {
                'id': 'test_server_1',
                'host': '127.0.0.1:27015',
                'connect_command': 'connect 127.0.0.1:27015'
            }
        }
    
    try:
        payload = json.dumps({
            'action': 'start_match',
            'match_id': match_id,
            'game_mode': game_mode,
            'team1_players': team1,
            'team2_players': team2
        }).encode('utf-8')
        
        req = urllib.request.Request(
            game_server_url,
            data=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result
            
    except Exception as e:
        print(f"Failed to start match on server: {e}")
        return {'success': False, 'error': str(e)}


def end_server_match(server_id: str, match_id: str):
    '''
    Завершение матча на сервере
    '''
    game_server_url = os.environ.get('GAME_SERVER_URL', '')
    
    if not game_server_url:
        return
    
    try:
        payload = json.dumps({
            'action': 'end_match',
            'match_id': match_id,
            'server_id': server_id
        }).encode('utf-8')
        
        req = urllib.request.Request(
            game_server_url,
            data=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        urllib.request.urlopen(req, timeout=10)
        
    except Exception as e:
        print(f"Failed to end match on server: {e}")


def error_response(message: str, status_code: int = 400) -> Dict:
    return {
        'statusCode': status_code,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': message})
    }
