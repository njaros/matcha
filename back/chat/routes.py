from flask import request, current_app, jsonify
from datetime import datetime, timezone
import pytz
from chat import sql as chat_sql
from user_module import sql as user_sql

def add_message():
    content = request.form.get('content')
    sender_id = request.form.get('sender_id')
    room_id = request.form.get('room_id')
    current_app.logger.info(sender_id)

    data = {
        'content': content,
        'sender_id': sender_id,
        'room_id': room_id,
    }

    chat_sql.insert_message(data)
    return [], 200

def add_room():
    user_id1 = request.form.get('user_id1')
    user_id2 = request.form.get('user_id2')

    data = {
        'user_id1': user_id1,
        'user_id2': user_id2,
    }
    chat_sql.insert_room(data)
    return [], 200

def get_room_with_message():
    return chat_sql.get_room_with_message(request.form.get('room_id'))


def get_message():
    room = get_room_with_message()
    return room['messages'], 200

