from flask import request, current_app
from user_module import sql as user_sql_request


def get_user_by_id():
    return user_sql_request.get_user_by_id(request.form.get('id'))

def get_user_by_username():
    return user_sql_request.get_user_by_username(request.form.get('username'))

def get_user_with_room():
    return user_sql_request.get_user_with_room(request.form.get('id'))


def get_user_with_room_and_message():
    return user_sql_request.get_user_with_room_and_message(request.form.get('id'))