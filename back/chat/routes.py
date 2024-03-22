from db_init import db_conn as conn
from flask import request, current_app, jsonify
from datetime import datetime, timezone
import pytz
from chat import sql as chat_sql

def add_message():
    content = request.form.get('content')
    user_id = request.form.get('user_id')
    room_id = request.form.get('room_id')
    time =  datetime.now(timezone.utc)

    data = {
        'content': content,
        'user_id': user_id,
        'room_id': room_id,
        'time': time
    }

    chat_sql.insert_message(data)
    return [], 200

def add_room():
    user_id1 = request.form.get('user_id1')
    user_id2 = request.form.get('user_id2')

    data = {
        'user_id1': user_id1,
        'user_id2': user_id2
    }

    chat_sql.insert_room(data)
    return [], 200