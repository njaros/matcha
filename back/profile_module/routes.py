from jwt_policy.jwt_policy import token_required
from flask import request, current_app as app


@token_required
def upload_image(current_user):
    app.logger.log("upload image : {}".format(current_user))
    