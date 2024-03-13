from flask import request
import hashlib
from auth import sql


def auth_routes(app, conn):
    @app.route("/sign", methods=["POST"])
    def sign():
        user_data = {"test": 4}
        user_data["user_name"] = request.form["user_name"]
        user_data["email"] = request.form["email"]
        user_data["password"] = hashlib.sha256(request.form["password"].encode("utf-8")).hexdigest()
        print(user_data["password"])
        sql.insert_new_user_in_database(conn, user_data)
        return "OK"
