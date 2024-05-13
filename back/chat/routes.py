from flask import request, current_app, jsonify
from datetime import datetime, timezone
import pytz
from chat import sql as chat_sql
from user_module import sql as user_sql
from validators import uuid
from jwt_policy.jwt_policy import token_required

#verifier si la personne qui ajoute le message est dans la room

@token_required
def add_message(**kwargs):
    return chat_sql.insert_message(data = {
        'content': request.json['content'],
        'sender_id': kwargs['user']['id'],
        'room_id': uuid.isUuid(request.json['room_id']),
    })

@token_required
def add_room(**kwargs):
    user_id1 = uuid.isUuid(request.form.get('user_id1'))
    user_id2 = uuid.isUuid(request.form.get('user_id2'))

    data = {
        'user_id1': user_id1,
        'user_id2': user_id2,
    }
    chat_sql.insert_room(data)
    return [], 200

@token_required
def get_room(**kwargs):
    return chat_sql.get_room(uuid.isUuid(request.form.get('room_id')))

@token_required
def get_room_with_message(**kwargs):
    return chat_sql.get_room_with_message(uuid.isUuid(request.json['room_id']))

@token_required
def get_message(**kwargs):
    room = get_room_with_message()
    return room['messages'], 200

@token_required
def get_room_list_by_id(**kwargs):
    return chat_sql.get_room_list_by_id(kwargs['user']['id'])

@token_required
def get_message_list_by_room_id(**kwargs):
    return chat_sql.get_message_list_by_room_id((uuid.isUuid(request.json['room_id'])))