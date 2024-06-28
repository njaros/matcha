from functools import wraps
import jwt
from datetime import datetime, timezone, timedelta
from error_status.error import BadRequestError
from flask import request, current_app as app, make_response
from .sql import get_user_by_id
from validators import str
from uuid import UUID


def options_handler(f):
    """Usefull to debug CORS problems
    if wraps a route and handle the OPTIONS method of a request"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == "OPTIONS":
            response = make_response()
            # put headers here response.headers["some opt"]="some value"
            response.status = 200
            return response
        return (f(*args, *kwargs))
    return decorated


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            raise BadRequestError("no token")
        kwargs["access_token"] = token
        try:
            data = jwt.decode(token, app.config["SECRET_ACCESS"],
                              algorithms=["HS256"])
            expDate = data.get("exp")
            if expDate is None:
                raise BadRequestError("token expiration date is expired")
            kwargs["user"] = get_user_by_id(data["user_id"])
        except jwt.exceptions.InvalidTokenError as e:
            app.logger.info(f"error: {e}")
            raise BadRequestError("Invalid Authentication token")
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
                     timedelta(days=1)},
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


def update_access_token(**kwargs):
    try:
        refresh_data = jwt.decode(kwargs["refresh_token"],
                                  app.config["SECRET_REFRESH"],
                                  algorithms="HS256")
    except Exception:
        raise BadRequestError("failed to read refresh_token")
    access_id = kwargs["user"]["id"]
    refresh_id = UUID(refresh_data["user_id"])
    if access_id != refresh_id:
        raise BadRequestError("incoherent user token owner")
    exp_refresh = refresh_data["exp"]
    now = datetime.now(tz=timezone.utc).timestamp()
    if exp_refresh < now:
        raise BadRequestError("refresh_token expired")
    response = make_response({"access_token":
                              create_access_token(access_id)})
    response.status = 200
    if exp_refresh - now < 3600:
        response.set_cookie("refresh_token",
                            create_refresh_token(access_id),
                            httponly=True,
                            secure=True,
                            samesite="none")
    return response


# @options_handler
@token_required
def refresh(**kwargs):
    kwargs["refresh_token"] = str.isString(request.cookies["refresh_token"])
    response = update_access_token(**kwargs)
    return response
