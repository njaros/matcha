from functools import wraps
import jwt
from flask import request, abort
from auth import sql
from api import app


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return {
                "message": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized"
            }, 401
        try:
            data = jwt.decode(token, app.config["SECRET_KEY"],
                              algorithms=["HS256"])
            current_user = sql.get_user_by_id(data["user_id"])
            if current_user is None:
                return {
                        "message": "Invalid Authentication token!",
                        "data": None,
                        "error": "Unauthorized"
                }, 401
            if not current_user["active"]:
                abort(403)
        except Exception as e:
            return {
                "message": "Something went wrong",
                "data": None,
                "error": str(e)
            }, 500

        return f(current_user, *args, **kwargs)

    return decorated


def create_token(user_id, secret):
    return jwt.encode(
                    {"user_id": user_id},
                    secret,
                    algorithm="HS256"
                )
