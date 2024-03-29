from db_init import db_conn as conn
from flask import request, current_app, jsonify
from datetime import datetime, timezone
import pytz
from chat import sql as chat_sql

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