from functools import wraps
import jwt
from datetime import datetime, timezone, timedelta
from flask import request, current_app as app
from common_sql_requests.user_context import sql


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        app.logger.info(request.headers)
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return {
                "message": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized"
            }, 401
        try:
            data = jwt.decode(token, app.config["SECRET_ACCESS"],
                              algorithms=["HS256"])
            expDate = data.get("exp")
            if expDate is None:
                return {
                    "message": "Invalid Authentication token: \
                        no expiration date",
                    "data": None,
                    "error": "Unauthorized"
                }, 401
            if expDate < datetime.now(tz=timezone.utc).timestamp():
                return {
                    "message": "Invalid Authentication token: \
                        token expired",
                    "data": None,
                    "error": "Unauthorized"
                }, 401
            current_user = sql.get_user_by_id(data["user_id"])
            if current_user is None:
                return {
                        "message": "Invalid Authentication token: \
                            user not found",
                        "data": None,
                        "error": "Unauthorized"
                }, 401
        except Exception as e:
            return {
                "message": "Something went wrong",
                "data": None,
                "error": str(e)
            }, 500

        return f(*args, **kwargs)

    return decorated


def create_access_token(user_id):
    if type(user_id) is str:
        hex = user_id
    else:
        hex = user_id.hex
    return jwt.encode(
                    {"user_id": hex,
                     "exp": datetime.now(tz=timezone.utc) +
                     timedelta(seconds=10)},
                    app.config["SECRET_ACCESS"],
                    algorithm="HS256"
                )


def create_refresh_token(user_id):
    if type(user_id) is str:
        hex = user_id
    else:
        hex = user_id.hex
    return jwt.encode(
        {"user_id": hex,
         "exp": datetime.now(tz=timezone.utc) +
         timedelta(days=1)},
        app.config["SECRET_REFRESH"],
        algorithm="HS256"
        )


def update_access_token(access_token, refresh_token):
    access_data = jwt.decode(access_token,
                             app.config["SECRET_ACCESS"],
                             algorithms="HS256")
    refresh_data = jwt.decode(refresh_token,
                              app.config["SECRET_REFRESH"],
                              algorithms="HS256")
    access_id = access_data.get("user_id")
    refresh_id = access_data.get("user_id")
    if access_id is None or access_id != refresh_id:
        return None
    exp_access = access_data.get("exp")
    exp_refresh = refresh_data.get("exp")
    if exp_access is None or exp_refresh is None:
        return None
    now = datetime.now(tz=timezone.utc).timestamp()
    if exp_access < now or exp_refresh < now:
        return None
    return [create_access_token(access_id),
            create_refresh_token(access_id)]


def refresh():
    data: dict = request.get_json()
    parse = {}
    try:
        parse["access"] = data["access_token"]
        parse["refresh"] = data["refresh_token"]
    except Exception:
        return ["jwt_policy:refresh(): bad arguments"], 400
    newTokens = update_access_token(data["access_token"],
                                    data["refresh_token"])
    if newTokens is None:
        return ["jwt_policy:refresh(): unable to refresh tokens"], 400
    return newTokens, 200
