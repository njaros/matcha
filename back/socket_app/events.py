from extensions import socketio
from flask_socketio import join_room, leave_room
from flask import request, current_app
from user_module.sql import get_user_with_room
from uuid import UUID

connected_clients = {}

@socketio.on('connect')
def handle_connection():
    client_id = request.sid
    current_app.logger.info('Connection of socket ID: {}'.format(client_id))
    user_id = request.args.get('userId')
    token = request.args.get('token')
    room_name = f'user-{user_id}'
    join_room(room_name)
    current_app.logger.info(f"Client {client_id} joined room {room_name}")
    connected_clients[client_id] = {'user_id': user_id, 'token': token}
    # for room_id in get_user_with_room(UUID(user_id)):
    #     join_room(room_id)
    #faire join les socket dans leur room respectives

@socketio.on('disconnect')
def handle_disconnect():
    client_id = request.sid
    current_app.logger.info("Disconnect of socket ID: " + client_id)
    leave_room(client_id)