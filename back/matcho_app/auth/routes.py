from flask import request
import hashlib
from auth import sql
from jwt_policy import jwt_policy
from CORS_killer import we_hate_CORS as c
from flask_cors import cross_origin


def auth_routes(app):
    @app.route("/sign", methods=["POST"])
    def sign():
        sign_data = {}
        sign_data["username"] = request.form["username"]
        sign_data["email"] = request.form["email"]
        sign_data["password"] = hashlib.sha256(request.form["password"]
                                               .encode("utf-8")).hexdigest()
        sql.insert_new_user_in_database(sign_data)
        return "OK"

    @app.route("/login", methods=["POST", "OPTIONS"])
    @cross_origin(
                  methods=["POST"],
                  supports_credentials=True,
                  allow_headers=[
                      "Content-Type",
                      "Access-Control-Allow-Origin",
                      "Access-Control-Request-Methods",
                      "Access-Control-Allow-Credentials",
                      "Access-Control-Allow-Headers",
                      ],
                  )
    def login():
        if request.method == "OPTIONS":
            return c.options_response()
        app.logger.info(request.form)
        login_data = {}
        login_data["username"] = request.form["username"]
        login_data["password"] = hashlib.sha256(request.form["password"]
                                                .encode("utf-8")).hexdigest()
        returned_id = sql.login_user_in_database(login_data)
        if returned_id is not None:
            return [jwt_policy.create_token(returned_id, app.config["SECRET"]), 200]
        else:
            return ["wrong user name or password", 200]

    @app.route("/test", methods=["POST"])
    @jwt_policy.token_required
    def test():
        return "OK token"
