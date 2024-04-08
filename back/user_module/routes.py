from flask import request, current_app
from user_module import sql as user_sql_request
def get_user_with_room():
    return user_sql_request.get_user_with_room(request.form.get('id'))