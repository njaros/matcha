from extensions import socketio
from flask_socketio import join_room, leave_room
from flask import request, current_app
from user_module.sql import get_user_by_id_with_room
from uuid import UUID

connected_clients = {}

@socketio.on('connect')
def handle_connection():
    client_id = request.sid
    current_app.logger.info('Connection of socket ID: {}'.format(client_id))
    user_id = request.args.get('userId')
    token = request.args.get('token')
    room_user = f'user-{user_id}'
    join_room(room_user)
    current_app.logger.info(f"Client {client_id} joined room {room_user}")
    connected_clients[client_id] = {'user_id': user_id, 'token': token}
    user = get_user_by_id_with_room(user_id)
    if user is None:
        current_app.logger.info('User not found in database.')
        return
    if 'rooms' is not None in user:
        for room in user['rooms']:
            join_room(f"room-{room['room_id']}")


@socketio.on('disconnect')
def handle_disconnect():
    client_id = request.sid
    current_app.logger.info("Disconnect of socket ID: " + client_id)
    leave_room(client_id)