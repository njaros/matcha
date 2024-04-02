from jwt_policy.jwt_policy import token_required
from flask import request, current_app as app
from .dto import image_dto


@token_required
@image_dto
def upload(accepted_files, denied_files, current_user):
    app.logger.info([elt[1] for elt in accepted_files])
    app.logger.info(denied_files)
    data = {
        "accepted": [elt[1] for elt in accepted_files],
        "denied": denied_files
    }
    app.logger.info(data)
    return data, 200
