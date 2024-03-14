from flask import request
import hashlib
from auth import sql
from jwt_policy import jwt_policy
from api import app


def auth_routes():
    @app.route("/sign", methods=["POST"])
    def sign():
        sign_data = {}
        sign_data["username"] = request.form["username"]
        sign_data["email"] = request.form["email"]
        sign_data["password"] = hashlib.sha256(request.form["password"]
                                               .encode("utf-8")).hexdigest()
        sql.insert_new_user_in_database(sign_data)
        return "OK"

    @app.route("/login", methods=["POST"])
    def login():
        print(request.form)
        login_data = {}
        login_data["username"] = request.form["username"]
        login_data["password"] = hashlib.sha256(request.form["password"]
                                                .encode("utf-8")).hexdigest()
        returned_id = sql.login_user_in_database(login_data)
        if returned_id is not None:
            return jwt_policy.create_token(returned_id, app.config["SECRET"])
        else:
            return "wrong user name or password"

    @app.route("/test", methods=["POST"])
    @jwt_policy.token_required
    def test():
        return "OK token"
