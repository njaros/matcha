from extensions import socketio
from flask_socketio import join_room, leave_room
from flask import request, current_app

@socketio.on('connect')
def handle_connection():
    client_id = request.sid
    current_app.logger.info('Connection of socket ID: {}'.format(client_id))
    user_id = request.args.get('userId')
    room_name = f'user-{user_id}'
    join_room(room_name)
    current_app.logger.info(f"Client {client_id} joined room {room_name}")

@socketio.on('disconnect')
def handle_disconnect():
    client_id = request.sid
    current_app.logger.info("Disconnect of socket ID: " + client_id)
    leave_room(client_id)