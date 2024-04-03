from jwt_policy.jwt_policy import token_required
import base64
from flask import jsonify, request, current_app as app
from .dto import image_dto
from error_status.error import *
from .sql import *


@token_required
@image_dto
def upload(**kwargs):
    
        insert_photos(**kwargs)
        return jsonify({"accepted": [elt[1] for elt in kwargs["accepted"]], "denied": kwargs["denied"]}), 200


@token_required
def get_photos(**kwargs):
    return jsonify({"photos":
                        [{
                            "id": elt["id"],
                            "mimetype": elt["mime_type"],
                            "binaries": base64.b64encode(elt["binaries"]).decode("utf-8"),
                            "main": elt["main"]
                            }
                            for elt in get_photos_by_user_id(kwargs["user"]["id"])]}), 200


@token_required
def delete_photo(**kwargs):
    photo = get_photo_by_id(request.form["photo_id"])
    if photo is None:
        raise(BadRequestError("photo not found"))
    if photo["user_id"] != kwargs["user"]["id"]:
        raise(BadRequestError("That is not your property !!"))
    if delete_photo_by_id(photo["id"]) == 0:
        raise(BadRequestError("failed to delete photo"))
    if photo["main"] == True:
        main_id = set_a_main_photo(kwargs["user"]["id"])
    else:
        main_id = ""
    return jsonify({"mainId": main_id}), 200


@token_required
def change_main_photo(**kwargs):
    photos = get_photos_by_user_id(kwargs["user"]["id"])
    current_main_id = None
    future_main_id = None
    requested_photo_id = request.form["photo_id"]
    if photos is None:
        raise (BadRequestError("you have no photo"))
    for photo in photos:
        if photo["main"] == True:
            current_main_id = photo["id"]
            if str(photo["id"]) == str(requested_photo_id):
                raise (BadRequestError("that is already your main photo"))
        elif str(photo["id"]) == str(requested_photo_id):
            future_main_id = photo["id"]
            if photo["main"] == True:
                raise (BadRequestError("that is already your main photo"))
    if future_main_id is None:
        raise (BadRequestError("it seems that photo isn't belong to you"))
    change_main_photo_by_ids(current_main_id, future_main_id)
    return [], 200
