from flask import request, current_app
from relationship import sql as relationship_sql
from jwt_policy.jwt_policy import token_required
from validators import uuid
from error_status.error import ForbiddenError
from chat.sql import insert_room
from .dto import remove_like_dto, report_dto
from swipe_module.sql import dislike_user
import base64
from cryptography.fernet import Fernet
from tools.matcha_socketio import emit


@token_required
def get_relationship_by_id(**kwargs):
    rel = relationship_sql.get_relationship_by_id(
        uuid.isUuid(request.form.get("id"))
    )
    if kwargs["user"]["id"] == str(rel["liker_id"]) or kwargs["user"][
        "id"
    ] == str(rel["liked_id"]):
        return rel
    raise ForbiddenError("You cannot acces to this information.")


@token_required
def get_relationship_by_liker_id(**kwargs):
    rel = relationship_sql.get_relationship_by_liker_id(
        uuid.isUuid(request.form.get("id"))
    )
    if (
        str(rel["liker_id"]) == kwargs["user"]["id"]
        or str(rel["liked_id"]) == kwargs["user"]["id"]
    ):
        return rel
    raise ForbiddenError("You cannot acces to this information.")


@token_required
def get_relationship_by_liked_id(**kwargs):
    rel = relationship_sql.get_relationship_by_liked_id(
        uuid.isUuid(request.form.get("id"))
    )
    if (
        str(rel["liker_id"]) == kwargs["user"]["id"]
        or str(rel["liked_id"]) == kwargs["user"]["id"]
    ):
        return rel
    raise ForbiddenError("You cannot acces to this information.")


@token_required
def is_matched(**kwargs):
    data = {
        "liker_id": uuid.isUuid(request.form["liker_id"]),
        "liked_id": uuid.isUuid(request.form["liked_id"]),
    }
    is_matched = relationship_sql.is_matched(data)
    if (
        str(is_matched["liker_id"]) == kwargs["user"]["id"]
        or str(is_matched["liked_id"]) == kwargs["user"]["id"]
    ):
        return "success"
    raise ForbiddenError("You cannot acces to this information.")


@token_required
def create_room_when_user_are_matched():
    if is_matched() == "success":
        return insert_room(
            {
                "user_id1": uuid.isUuid(request.form["liker_id"]),
                "user_id2": uuid.isUuid(request.form["liked_id"]),
            }
        )


@token_required
@remove_like_dto
def remove_like(**kwargs):
    relationship_sql.remove_like(**kwargs)
    emit(
        "unliked",
        kwargs["user_id"],
        kwargs["user"]["id"],
        {"id": str(kwargs["user"]["id"])}
    )
    return [], 200


@token_required
def get_matches(**kwargs):
    hasher = Fernet(current_app.config["SECRET_PHOTO"])
    list = relationship_sql.get_matches_by_user_id(**kwargs)
    for elt in list:
        if elt["binaries"] is not None:
            elt["binaries"] = base64.b64encode(
                hasher.decrypt(elt["binaries"])
            ).decode("utf-8")
    return list, 200


@token_required
def get_liked_not_matched(**kwargs):
    hasher = Fernet(current_app.config["SECRET_PHOTO"])
    list = relationship_sql.get_liked_by_user_id(**kwargs)
    for elt in list:
        if elt["binaries"] is not None:
            elt["binaries"] = base64.b64encode(
                hasher.decrypt(elt["binaries"])
            ).decode("utf-8")
    return list, 200


@token_required
@report_dto
def report_user(**kwargs):
    user_deleted = relationship_sql.report_user(**kwargs)
    if user_deleted is False:
        relationship_sql.remove_like(**kwargs)
        kwargs["target_id"] = kwargs["user_id"]
        dislike_user(**kwargs)
    return [], 200
