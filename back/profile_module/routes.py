from jwt_policy.jwt_policy import token_required
import base64
from flask import jsonify, send_file, current_app as app
from .dto import image_dto
from error_status.error import *
from .sql import insert_photos, get_photos_by_user_id


@token_required
@image_dto
def upload(**kwargs):
    try:
        insert_photos(**kwargs)
        return jsonify({"accepted": [elt[1] for elt in kwargs["accepted"]], "denied": kwargs["denied"]}), 200
    except Exception:
        raise(InternalServerError("Something went wrong"))


@token_required
def get_photos(**kwargs):
    return jsonify({"photos":
                        [{
                            "id": elt[0],
                            "mimetype": elt[1],
                            "binaries": base64.b64encode(elt[2]).decode("utf-8")
                            }
                            for elt in get_photos_by_user_id(kwargs["user"]["id"])]}), 200
