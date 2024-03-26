from jwt_policy.jwt_policy import token_required
from flask import request, current_app as app


@token_required
def upload(current_user):
    f = request.files["file"]
    app.logger.info(f)
    return request.form, 200

