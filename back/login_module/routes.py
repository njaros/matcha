from flask import request, current_app
import hashlib
from jwt_policy import jwt_policy
from login_module import sql as login_ctx
from common_sql_requests.user_context import sql as user_ctx


def sign():
    data = request.get_json()
    if user_ctx.get_user_by_username(data["username"]) is not None:
        return ["conflit error : username already exists"], 409
    sign_data = {}
    sign_data["username"] = data["username"]
    sign_data["email"] = data["email"]
    sign_data["password"] = hashlib.sha256(data["password"]
                                           .encode("utf-8")).hexdigest()
    login_ctx.insert_new_user_in_database(sign_data)
    return [], 201


def login():
    data: dict = request.get_json()
    login_data = {}
    login_data["username"] = data["username"]
    login_data["password"] = hashlib.sha256(data["password"]
                                            .encode("utf-8")).hexdigest()
    returned_id = login_ctx.login_user_in_database(login_data)
    if returned_id is not None:
        current_app.logger.info(returned_id)
        return [jwt_policy.create_access_token(returned_id),
                jwt_policy.create_refresh_token(returned_id)], 200
    else:
        return [], 401
