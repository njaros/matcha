from flask import request, current_app
from user_module import sql as user_sql_request
from jwt_policy.jwt_policy import token_required


@token_required
def get_user_by_id(**kwargs):
    return kwargs['user']


def get_user_by_username():
    return user_sql_request.get_user_by_username(request.form.get('username'))


@token_required
def get_user_with_room(**kwargs):
    return user_sql_request.get_user_with_room(kwargs['user']['id'])


@token_required
def get_user_with_room_and_message(**kwargs):
    return user_sql_request.get_user_with_room_and_message(kwargs['user']['id'])


@token_required
def get_me(**kwargs):
    return kwargs['user']