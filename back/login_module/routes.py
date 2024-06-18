from flask import make_response, request, current_app
import hashlib
from jwt_policy import jwt_policy
from login_module import sql as login_ctx
from user_module import sql as user_ctx
from error_status.error import BadRequestError
from tools import GPS_tools
from . import dto
from tools.email_tools import send_email_register_token, send_reset_password


@dto.signup_dto
def sign(**kwargs):
    if user_ctx.get_user_by_email(kwargs["email"]) is not None:
        raise (BadRequestError("email already exists"))
    kwargs["password"] = hashlib.sha256(
        kwargs["password"].encode("utf-8")
    ).hexdigest()
    kwargs["id"] = login_ctx.insert_new_user_in_database(kwargs)[0].hex
    send_email_register_token(**kwargs)
    return [], 201


@dto.login_dto
def login(**kwargs):
    kwargs["password"] = hashlib.sha256(
        kwargs["password"].encode("utf-8")
    ).hexdigest()
    login_ctx.login_user_in_database(kwargs)
    if kwargs["user"] is not None:
        current_app.logger.info(kwargs)
        if (kwargs["latitude"] is None) and (
            kwargs["user"]["gpsfixed"] is False
        ):
            ip_loc = GPS_tools.get_gps_from_ip(request.remote_addr)
            current_app.logger.info(ip_loc)
            if ip_loc is not None:
                kwargs["user"]["latitude"] = ip_loc.latitude
                kwargs["user"]["longitude"] = ip_loc.longitude
                login_ctx.update_gps_loc_by_id(**kwargs)
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


@dto.mail_register_dto
def mail_register(**kwargs):
    login_ctx.activate_mail_account(**kwargs)
    return "<h1>Yeah ! your account is activate</h1>", 200


@dto.reset_password_dto
def reset_password(**kwargs):
    send_reset_password(**kwargs)
    return "email sent", 200


@dto.confirm_reset_password_dto
def confirm_reset_password(**kwargs):
    kwargs["new_pass"] = hashlib.sha256(
        kwargs["new_pass"].encode("utf-8")
    ).hexdigest()
    login_ctx.update_password_by_email(**kwargs)
    return "<h1>Yeah ! Your password has be successfully reset</h1>", 200
