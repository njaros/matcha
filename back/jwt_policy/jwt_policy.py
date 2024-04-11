from functools import wraps
import jwt
from datetime import datetime, timezone, timedelta
from flask import request, current_app as app
from flask_restful import abort
from .sql import get_user_by_id


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            abort(400, "no token")
        try:
            data = jwt.decode(token, app.config["SECRET_ACCESS"],
                              algorithms=["HS256"])
            expDate = data.get("exp")
            if expDate is None:
                abort(401, "token expiration date is expired")
            kwargs["user"] = get_user_by_id(data["user_id"])
            if kwargs["user"] is None:
                abort(401, "user not found")
        except jwt.exceptions.InvalidTokenError:
            abort(401, "Invalid Authentication token")
        except Exception:
            abort(500, "Unhandled error")

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
                     timedelta(minutes=1200)},
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
    try:
        access_data = jwt.decode(access_token,
                                 app.config["SECRET_ACCESS"],
                                 algorithms="HS256")
    except Exception:
        return None
    try:
        refresh_data = jwt.decode(refresh_token,
                                  app.config["SECRET_REFRESH"],
                                  algorithms="HS256")
    except Exception:
        return None
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
    if exp_refresh - now < 3600:
        return [create_access_token(access_id),
                create_refresh_token(access_id)]
    return [create_access_token(access_id)]


def refresh():
    parse = {}
    try:
        parse["access"] = request.form["access_token"]
        parse["refresh"] = request.form["refresh_token"]
    except Exception:
        return ["jwt_policy:refresh(): bad arguments"], 400
    newTokens = update_access_token(request.form["access_token"],
                                    request.form["refresh_token"])
    if newTokens is None:
        return ["jwt_policy:refresh(): unable to refresh tokens"], 400
    return newTokens, 200
