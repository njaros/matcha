from db_init import db_conn as conn
from flask import request, current_app, jsonify
import hashlib
from jwt_policy import jwt_policy
from login_module import sql


def sign():
    data = request.get_data()["data"]
    sign_data = {}
    sign_data["username"] = data["username"]
    sign_data["email"] = data["email"]
    sign_data["password"] = hashlib.sha256(request.form["password"]
                                           .encode("utf-8")).hexdigest()
    sql.insert_new_user_in_database(sign_data)
    return "OK"


def login():
    data: dict = request.get_json()["data"]
    current_app.logger.info(data)
    login_data = {}
    login_data["username"] = data["username"]
    login_data["password"] = hashlib.sha256(data["password"]
                                            .encode("utf-8")).hexdigest()
    returned_id = sql.login_user_in_database(login_data)
    if returned_id is not None:
        return [jwt_policy.create_token(returned_id,
                                        current_app.config["SECRET"]), 200]
    else:
        return ["wrong user name or password", 200]
