from flask import request, current_app, jsonify
from user_module import sql as user_sql_request
from jwt_policy.jwt_policy import token_required
from validators import uuid
from error_status.error import NotFoundError
from uuid import UUID
from cryptography.fernet import Fernet
from tools import GPS_tools
import base64
from . import dto


@token_required
def get_user_by_id(**kwargs):
    return kwargs["user"]


@token_required
def get_user_by_username(**kwargs):
    return user_sql_request.get_user_by_username(kwargs["user"]["username"])


@token_required
def get_user_with_room(**kwargs):
    return user_sql_request.get_user_with_room(UUID(kwargs["user"]["id"]))


@token_required
def get_user_with_room_and_message(**kwargs):
    return user_sql_request.get_user_with_room_and_message(
        UUID(kwargs["user"]["id"])
    )


@token_required
def get_gps(**kwargs):
    current_app.logger.info(kwargs)
    return jsonify(
        {
            "latitude": kwargs["user"]["latitude"],
            "longitude": kwargs["user"]["longitude"],
        }
    )


@token_required
def get_me(**kwargs):
    return kwargs["user"]


@token_required
@dto.user_profile_dto
def get_user_profile(**kwargs):
    hasher = Fernet(current_app.config["SECRET_PHOTO"])
    user_profile = user_sql_request.get_user_profile(**kwargs)
    if user_profile is not None:
        if user_profile["photos"] is not None:
            for photo in user_profile["photos"]:
                photo["binaries"] = base64.b64encode(
                    hasher.decrypt(photo["binaries"])
                ).decode("utf-8")
        user_profile["location"] = GPS_tools.get_town(
            user_profile["latitude"], user_profile["longitude"]
        )
        del user_profile["latitude"]
        del user_profile["longitude"]
        current_app.logger.info(user_profile)
        return user_profile, 200
    raise NotFoundError(f'user {kwargs["user_id"]} not found')
