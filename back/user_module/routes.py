from flask import request, current_app, jsonify
from user_module import sql as user_sql_request
from jwt_policy.jwt_policy import token_required
from validators import uuid
from uuid import UUID


@token_required
def get_user_by_id(**kwargs):
    current_app.logger.info(kwargs["user"])
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
