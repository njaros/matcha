from functools import wraps
import jwt
from datetime import datetime, timezone, timedelta
from error_status.error import BadRequestError, InternalServerError
from flask import request, current_app as app, make_response
from .sql import get_user_by_id
from validators import str
from uuid import UUID


def options_get_handler(f):
    """Sometimes CORS is boring af
    this wrap allows to make the credentials works for
    GET request"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == "OPTIONS":
            response = make_response()
            response.status = 200
            return response
        return(f(*args, *kwargs))
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
            if kwargs["user"] is None:
                raise BadRequestError("user not found in database")
        except jwt.exceptions.InvalidTokenError:
            raise BadRequestError("Invalid Authentication token")
        except Exception:
            raise InternalServerError("Unhandled error")

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


def update_access_token(**kwargs):
    try:
        refresh_data = jwt.decode(kwargs["refresh_token"],
                                  app.config["SECRET_REFRESH"],
                                  algorithms="HS256")
    except Exception:
        raise BadRequestError("failed to read refresh_token")
    access_id = UUID(kwargs["user"]["id"])
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
                            httponly= True)
    return response


#@options_get_handler
@token_required
def refresh(**kwargs):
    app.logger.info(request.cookies.get("refresh_token"))
    kwargs["refresh_token"] = str.isString(request.cookies["refresh_token"])
    app.logger.info(kwargs["refresh_token"])
    response = update_access_token(**kwargs)
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response
