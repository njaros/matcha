from flask import request, current_app
from error_status.error import ForbiddenError, NotFoundError
from datetime import datetime, timezone
import pytz
from chat import sql as chat_sql
from user_module import sql as user_sql
from validators import uuid
from jwt_policy.jwt_policy import token_required
from .dto import message_dto

#verifier si la personne qui ajoute le message est dans la room


@message_dto
@token_required
def add_message(**kwargs):
    if chat_sql.correct_room(kwargs["room_id"], kwargs["user"]["id"]) is None:
        raise ForbiddenError("this room doesn't exist")
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


@token_required
def increment_unread_msg_count(**kwargs):
    chat_sql.increment_unread_msg_count(kwargs['user']['id'], uuid.isUuid(request.json['room_id']))
    return [], 200 


@token_required
def set_unread_msg_count_to_0(**kwargs):
    current_app.logger.info('######################################## TEST #############################################')
    chat_sql.set_unread_msg_count_to_0(kwargs['user']['id'], uuid.isUuid(request.json['room_id']))
    return [], 200


@token_required
def get_unread_msg_count(**kwargs):
    count = chat_sql.get_unread_msg_count(kwargs['user']['id'], uuid.isUuid(request.json['room_id']))
    if count is None:
        raise NotFoundError("This room doesn't exists")
    return count
