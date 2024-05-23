from extensions import socketio
from flask import request, current_app as app, jsonify
from flask_socketio import Namespace, emit
from socket_app.events import connected_clients
from chat.sql import get_room_with_message, get_room
from user_module.sql import get_user_by_id
from validators import str, uuid, int

@socketio.on('join_room')
def join_room(room_id):

    # if room_id is None:
    #     return jsonify({'error': 'Missing one or more required fields'}), 400

    # if not isinstance(room_id, str):
    #     app.logger.error('Wrong type of parameter')

    join_room(f'room-{room_id}')


@socketio.on('send_message')
def send_message(data):
    author = data.get('author')
    user_id = author.get('id')
    username = author.get('username')
    content = data.get('content')
    room_id = data.get('room_id')
    send_at = data.get('send_at')

    app.logger.info("User ID: %s, Username: %s, Content: %s, Room ID: %s, Send At: %s", user_id, username, content, room_id, send_at)
    if None in (user_id, username, content, room_id, send_at):
        return jsonify({'error': 'Missing one or more required fields'}), 400

    try:
        uuid.isUuid(user_id)
        uuid.isUuid(room_id)
    
    except Exception as error:
        if error.args:
            app.logger.error(error.args[0])

    # if not all(isinstance(param, str) for param in [ username, content, send_at]):
    #     app.logger.error('Wrong type of parameter')
    
    #try and catch
    room = get_room_with_message(room_id)
    if room is None:
        app.logger.info(f'Room {room_id} not found in database.')
    emit('receive_message', {
        'author': {'user_id': user_id, 'username': username},
        'content': content,
        'room': room_id,
        'send_at': send_at
    }, room=f"room-{room_id}", skip_sid=request.sid)
    emit('last_message', {
        'author': {'user_id': user_id, 'username': username},
        'content': content,
        'room': room_id,
        'send_at': send_at
    }, room=f"room-{room_id}")