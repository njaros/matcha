from flask import request, current_app, jsonify
import hashlib
from jwt_policy import jwt_policy
from login_module import sql as login_ctx
from common_sql_requests.user_context import sql as user_ctx
from error_status.error import BadRequestError
from . import dto


@dto.signup_dto
def sign(**kwargs):
    if user_ctx.get_user_by_username(kwargs["username"]) is not None:
        raise (BadRequestError("user already exists"))
    kwargs["password"] = hashlib.sha256(kwargs["password"]
                                           .encode("utf-8")).hexdigest()
    login_ctx.insert_new_user_in_database(kwargs)
    return [], 201


def login():
    login_data = {}
    login_data["username"] = request.form["username"]
    login_data["password"] = hashlib.sha256(request.form["password"]
                                            .encode("utf-8")).hexdigest()
    returned_id = login_ctx.login_user_in_database(login_data)
    if returned_id is not None:
        current_app.logger.info(returned_id)
        return jsonify({"access_token": jwt_policy
                        .create_access_token(returned_id),
                        "refresh_token": jwt_policy
                        .create_refresh_token(returned_id)}), 200
    else:
        raise (BadRequestError("Wrong username or password"))
