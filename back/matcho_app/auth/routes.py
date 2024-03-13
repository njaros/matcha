from flask import request
import hashlib
from auth import sql
from jwt_policy import jwt_policy


def auth_routes(app, conn):
    @app.route("/sign", methods=["POST"])
    def sign():
        sign_data = {}
        sign_data["user_name"] = request.form["user_name"]
        sign_data["email"] = request.form["email"]
        sign_data["password"] = hashlib.sha256(request.form["password"]
                                               .encode("utf-8")).hexdigest()
        sql.insert_new_user_in_database(sign_data)
        return "OK"

    @app.route("/login", methods=["POST"])
    def login():
        login_data = {}
        login_data["user_name"] = request.form["user_name"]
        login_data["password"] = hashlib.sha256(request.form["password"]
                                                .encode("utf-8")).hexdigest()
        returned_id = sql.login_user_in_database(login_data)
        if returned_id is not None:
            return jwt_policy.create_token(returned_id, app.config["SECRET"])
        else:
            return "wrong user name or password"
