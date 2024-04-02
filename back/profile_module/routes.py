from jwt_policy.jwt_policy import token_required
from flask import request, current_app as app
from .dto import image_dto


@token_required
@image_dto
def upload(**kwargs):
    app.logger.info([elt[1] for elt in kwargs["accepted"]])
    app.logger.info(kwargs["denied"])
    data = {
        "accepted": [elt[1] for elt in kwargs["accepted"]],
        "denied": kwargs["denied"]
    }
    app.logger.info(data)
    return data, 200
