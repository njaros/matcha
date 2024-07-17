from flask import current_app, jsonify
from tools.matcha_socketio import emit
from socket_app.utils import is_connected
from user_module import sql as user_sql_request
from profile_module.sql import get_photos_by_user_id
from jwt_policy.jwt_policy import token_required
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
    return user_sql_request.get_user_with_room_and_message(UUID(kwargs["user"]["id"]))


@token_required
def get_gps(**kwargs):
    return jsonify(
        {
            "latitude": kwargs["user"]["latitude"],
            "longitude": kwargs["user"]["longitude"],
        }
    )


@token_required
def get_me(**kwargs):
    return kwargs["user"]


def base_get_user_profile(**kwargs):
    hasher = Fernet(current_app.config["SECRET_PHOTO"])
    user_profile = user_sql_request.get_user_profile(**kwargs)
    if user_profile is not None:
        user_profile["photos"] = get_photos_by_user_id(kwargs["user_id"])
        if user_profile["photos"] is not None:
            for photo in user_profile["photos"]:
                photo["binaries"] = base64.b64encode(
                    hasher.decrypt(photo["binaries"])
                ).decode("utf-8")
        user_profile["location"] = GPS_tools.get_town(
            user_profile["latitude"], user_profile["longitude"]
        )
        user_profile["last_connection"] = user_profile["last_connection"].isoformat()
        del user_profile["latitude"]
        del user_profile["longitude"]
        user_profile["connected"] = is_connected(kwargs["user_id"])
        return user_profile
    raise NotFoundError(f'user {kwargs["user_id"]} not found')


@token_required
@dto.user_profile_dto
def get_user_profile_from_swipe(**kwargs):
    user_profile = base_get_user_profile(**kwargs)
    user_sql_request.visite_profile(**kwargs)
    emit(
        "viewed",
        user_profile["id"],
        kwargs["user"]["id"],
        {"id": str(kwargs["user"]["id"])},
    )
    return user_profile, 200


@token_required
@dto.user_profile_dto
def get_user_profile(**kwargs):
    return base_get_user_profile(**kwargs), 200


@token_required
def get_self_profile(**kwargs):
    kwargs["user_id"] = kwargs["user"]["id"]
    return base_get_user_profile(**kwargs), 200


@token_required
def get_visits_history(**kwargs):
    hasher = Fernet(current_app.config["SECRET_PHOTO"])
    history = user_sql_request.get_visited_me_history(**kwargs)
    for user in history:
        user["at"] = user["at"].isoformat()
        if user["binaries"] is not None:
            user["binaries"] = base64.b64encode(
                hasher.decrypt(user["binaries"])
            ).decode("utf-8")
    return history, 200


@token_required
@dto.user_profile_dto
def is_user_connected(**kwargs):
    user_state = {}
    user_state["connected"] = is_connected(kwargs["user_id"])
    if user_state["connected"] is False:
        user_state["last_connection"] = user_sql_request.last_connection_by_id(
            kwargs["user_id"]
        )["last_connection"]
    return user_state, 200
