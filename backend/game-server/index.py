'''
Business: Управление игровыми серверами CS:GO/CS2 через RCON
Args: event с httpMethod, body (action, match_id, server_id)
Returns: HTTP response с данными сервера или результатами команд
'''

import json
import os
import socket
import struct
from typing import Dict, Any, List, Optional

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
    
    # Загрузка конфигурации серверов
    servers_config_str = os.environ.get('GAME_SERVERS_CONFIG', '[]')
    servers: List[Dict] = json.loads(servers_config_str)
    
    if method == 'GET':
        action = event.get('queryStringParameters', {}).get('action', 'list')
        
        if action == 'list':
            # Список доступных серверов
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'servers': servers,
                    'available': [s for s in servers if s.get('status') == 'available']
                })
            }
        
        elif action == 'status':
            server_id = event.get('queryStringParameters', {}).get('server_id')
            server = next((s for s in servers if s['id'] == server_id), None)
            
            if not server:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Server not found'})
                }
            
            # Проверка статуса сервера через RCON
            status = check_server_status(server)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'server_id': server_id,
                    'status': status,
                    'host': server['host']
                })
            }
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'start_match':
            match_id = body_data.get('match_id')
            game_mode = body_data.get('game_mode', 'competitive')
            team1_players = body_data.get('team1_players', [])
            team2_players = body_data.get('team2_players', [])
            
            # Найти свободный сервер
            available_server = next((s for s in servers if s.get('status') == 'available'), None)
            
            if not available_server:
                return {
                    'statusCode': 503,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No available servers'})
                }
            
            # Настроить сервер для матча
            setup_result = setup_match_server(
                available_server,
                match_id,
                game_mode,
                team1_players,
                team2_players
            )
            
            if setup_result.get('success'):
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'match_id': match_id,
                        'server': {
                            'id': available_server['id'],
                            'host': available_server['host'],
                            'connect_command': f"connect {available_server['host']}"
                        },
                        'message': 'Match server ready'
                    })
                }
            else:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': setup_result.get('error', 'Failed to setup server')})
                }
        
        elif action == 'get_match_stats':
            match_id = body_data.get('match_id')
            server_id = body_data.get('server_id')
            
            server = next((s for s in servers if s['id'] == server_id), None)
            if not server:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Server not found'})
                }
            
            # Получить статистику матча
            stats = get_match_statistics(server, match_id)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'match_id': match_id,
                    'stats': stats
                })
            }
        
        elif action == 'end_match':
            match_id = body_data.get('match_id')
            server_id = body_data.get('server_id')
            
            server = next((s for s in servers if s['id'] == server_id), None)
            if not server:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Server not found'})
                }
            
            # Завершить матч и получить результаты
            results = end_match(server, match_id)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'match_id': match_id,
                    'results': results,
                    'server_id': server_id
                })
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }


def send_rcon_command(host: str, rcon_password: str, command: str, timeout: int = 5) -> Optional[str]:
    '''
    Отправка RCON команды на игровой сервер
    '''
    try:
        ip, port = host.split(':')
        port = int(port)
        
        # Source RCON Protocol
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        sock.connect((ip, port))
        
        # Авторизация
        request_id = 1
        auth_packet = struct.pack('<iii', 10 + len(rcon_password), request_id, 3) + rcon_password.encode('utf-8') + b'\x00\x00'
        sock.send(auth_packet)
        
        # Получение ответа авторизации
        sock.recv(4096)
        
        # Отправка команды
        request_id = 2
        cmd_packet = struct.pack('<iii', 10 + len(command), request_id, 2) + command.encode('utf-8') + b'\x00\x00'
        sock.send(cmd_packet)
        
        # Получение ответа
        response_data = sock.recv(4096)
        sock.close()
        
        # Парсинг ответа
        if len(response_data) >= 12:
            response_str = response_data[12:-2].decode('utf-8', errors='ignore')
            return response_str
        
        return None
        
    except Exception as e:
        print(f"RCON Error: {str(e)}")
        return None


def check_server_status(server: Dict) -> Dict:
    '''
    Проверка статуса сервера
    '''
    response = send_rcon_command(
        server['host'],
        server['rcon_password'],
        'status'
    )
    
    if response:
        return {
            'online': True,
            'response': response[:200]  # Первые 200 символов
        }
    
    return {'online': False}


def setup_match_server(
    server: Dict,
    match_id: str,
    game_mode: str,
    team1_players: List[str],
    team2_players: List[str]
) -> Dict:
    '''
    Настройка сервера для матча
    '''
    try:
        # Базовые команды настройки
        commands = [
            'mp_restartgame 1',
            f'hostname "Match #{match_id}"',
            'mp_warmup_end',
        ]
        
        # Настройки в зависимости от режима
        if game_mode == 'competitive':
            commands.extend([
                'mp_maxrounds 30',
                'mp_overtime_enable 1',
                'mp_overtime_maxrounds 6'
            ])
        elif game_mode == 'wingman':
            commands.extend([
                'mp_maxrounds 16',
                'mp_overtime_enable 1'
            ])
        
        # Выполнение команд
        for cmd in commands:
            send_rcon_command(server['host'], server['rcon_password'], cmd)
        
        # Обновление статуса сервера
        server['status'] = 'in_use'
        server['current_match'] = match_id
        
        return {'success': True}
        
    except Exception as e:
        return {'success': False, 'error': str(e)}


def get_match_statistics(server: Dict, match_id: str) -> Dict:
    '''
    Получение статистики текущего матча
    '''
    status_response = send_rcon_command(
        server['host'],
        server['rcon_password'],
        'status'
    )
    
    # Парсинг статистики (упрощенная версия)
    # В реальности нужен плагин на сервере для детальной статистики
    
    return {
        'raw_status': status_response[:500] if status_response else None,
        'match_id': match_id,
        'in_progress': True
    }


def end_match(server: Dict, match_id: str) -> Dict:
    '''
    Завершение матча и получение результатов
    '''
    # Получить финальную статистику
    stats = get_match_statistics(server, match_id)
    
    # Сброс сервера
    send_rcon_command(server['host'], server['rcon_password'], 'mp_restartgame 1')
    
    # Освобождение сервера
    server['status'] = 'available'
    server.pop('current_match', None)
    
    return {
        'match_id': match_id,
        'final_stats': stats,
        'server_reset': True
    }
