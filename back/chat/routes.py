from flask import request, current_app, jsonify
from datetime import datetime, timezone
import pytz
from chat import sql as chat_sql
from user_module import sql as user_sql
from validators import uuid

#verifier si la personne qui ajoute le message est dans la room
def add_message():
    
    chat_sql.insert_message(data = {
        'content': request.form.get('content'),
        'sender_id': uuid.isUuid(request.form.get('sender_id')),
        'room_id': uuid.isUuid(request.form.get('room_id')),
    })
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

def get_room():
    return chat_sql.get_room(uuid.isUuid(request.form.get('room_id')))

def get_room_with_message():
    return chat_sql.get_room_with_message(uuid.isUuid(request.form.get('room_id')))

def get_message():
    room = get_room_with_message()
    return room['messages'], 200

def get_room_list_by_id():
    current_app.logger.info(request.form.get('id'))
    return chat_sql.get_room_list_by_id(uuid.isUuid(request.form.get('id')))

