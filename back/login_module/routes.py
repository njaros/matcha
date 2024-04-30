from flask import make_response, request, current_app
import hashlib
from jwt_policy import jwt_policy
from login_module import sql as login_ctx
from user_module import sql as user_ctx
from error_status.error import BadRequestError
from tools import GPS_tools
from . import dto


@dto.signup_dto
def sign(**kwargs):
    if user_ctx.get_user_by_username(kwargs["username"]) is not None:
        raise (BadRequestError("user already exists"))
    kwargs["password"] = hashlib.sha256(
        kwargs["password"].encode("utf-8")
    ).hexdigest()
    login_ctx.insert_new_user_in_database(kwargs)
    return [], 201


@dto.login_dto
def login(**kwargs):
    kwargs["password"] = hashlib.sha256(
        kwargs["password"].encode("utf-8")
    ).hexdigest()
    login_ctx.login_user_in_database(kwargs)
    if kwargs["user"] is not None:
        if (kwargs["latitude"] is None) and (
            kwargs["user"]["gpsfixed"] is True
        ):
            ip_loc = GPS_tools.get_gps_from_ip(request.remote_addr)
            current_app.logger.info(ip_loc)
            if ip_loc is not None:
                kwargs["latitude"] = ip_loc.latitude
                kwargs["longitude"] = ip_loc.longitude
                login_ctx.update_gps_loc_by_id(kwargs)
        response = make_response(
            {
                "access_token": jwt_policy.create_access_token(
                    kwargs["user"]["id"]
                ),
                "latitude": kwargs["user"]["latitude"],
                "longitude": kwargs["user"]["longitude"],
                "gpsfixed": kwargs["user"]["gpsfixed"]
            }
        )
        response.set_cookie(
            "refresh_token",
            jwt_policy.create_refresh_token(kwargs["user"]["id"]),
            httponly=True,
            secure=True,
            samesite="none",
        )
        response.status = 200
        return response
    else:
        raise (BadRequestError("Wrong username or password"))
