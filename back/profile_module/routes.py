from jwt_policy.jwt_policy import token_required
import base64
from cryptography.fernet import Fernet
from flask import jsonify, request, current_app as app
from .dto import image_dto, bio_dto, update_user_dto
from error_status.error import BadRequestError
from . import sql
from user_module.sql import get_user_by_username
from tools import thingy


@token_required
@image_dto
def upload(**kwargs):
    sql.insert_photos(**kwargs)
    return jsonify({"accepted": [elt[1] for elt in kwargs["accepted"]],
                    "denied": kwargs["denied"]}), 200


@token_required
def get_photos(**kwargs):
    hasher = Fernet(app.config['SECRET_PHOTO'])
    return jsonify({"photos":
                    [{
                        "id": elt["id"],
                        "mimetype": elt["mime_type"],
                        "binaries": base64.b64encode(
                            hasher.decrypt(elt["binaries"])).decode("utf-8"),
                        "main": elt["main"]}
                     for elt in sql.get_photos_by_user_id(
                         kwargs["user"]["id"])]
                    }), 200


@token_required
def delete_photo(**kwargs):
    photo = sql.get_photos_by_id(request.form["photo_id"])
    if photo is None:
        raise (BadRequestError("photo not found"))
    if photo["user_id"] != kwargs["user"]["id"]:
        raise (BadRequestError("That is not your property !!"))
    if sql.delete_photo_by_id(photo["id"]) == 0:
        raise (BadRequestError("failed to delete photo"))
    if photo["main"] is True:
        main_id = sql.set_a_main_photo(kwargs["user"]["id"])
    else:
        main_id = ""
    return jsonify({"mainId": main_id}), 200


@token_required
def change_main_photo(**kwargs):
    photos = sql.get_photos_by_user_id(kwargs["user"]["id"])
    current_main_id = None
    future_main_id = None
    requested_photo_id = request.form["photo_id"]
    if photos is None:
        raise (BadRequestError("you have no photo"))
    for photo in photos:
        if photo["main"] is True:
            current_main_id = photo["id"]
            if str(photo["id"]) == str(requested_photo_id):
                raise (BadRequestError("that is already your main photo"))
        elif str(photo["id"]) == str(requested_photo_id):
            future_main_id = photo["id"]
            if photo["main"] is True:
                raise (BadRequestError("that is already your main photo"))
    if future_main_id is None:
        raise (BadRequestError("that photo isn't belong to you"))
    sql.change_main_photo_by_ids(current_main_id, future_main_id)
    return [], 200


@token_required
@bio_dto
def change_biography(**kwargs):
    sql.change_user_biography_by_id(**kwargs)
    return [], 200


@token_required
@update_user_dto
def update_user(**kwargs):
    notice = None
    if kwargs["username"] is not None:
        if get_user_by_username(kwargs["username"]) is not None:
            notice = "username already taken"
            kwargs["username"] = None
            if thingy.notNoneLen(kwargs) < 3:
                raise BadRequestError(notice + ", nothing to modify")
    app.logger.info(kwargs)
    if thingy.notNoneLen(kwargs) < 3:
        raise BadRequestError("nothing to modify")
    updated_user = sql.update_user(**kwargs)
    return jsonify({"notice": notice, "updated_user": updated_user}), 200
