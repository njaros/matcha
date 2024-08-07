from flask import Blueprint
from flask_cors import CORS
from .routes import (
    login,
    sign,
    mail_register,
    reset_password,
    confirm_reset_password,
)
from error_status.error import *


app = Blueprint("login", __name__)
CORS(
    app,
    supports_credentials=True,
    expose_headers="Access-Control-Allow-Origin",
)


app.add_url_rule("/login", "login", login, methods=["POST"])
app.add_url_rule("/sign", "sign", sign, methods=["POST"])
app.add_url_rule(
    "/mail_register/<token>", "mail_register", mail_register, methods=["GET"]
)
app.add_url_rule(
    "/reset_password", "reset_password", reset_password, methods=["POST"]
)
app.add_url_rule(
    "/confirm_reset_password/<token>",
    "confirm_reset_password",
    confirm_reset_password,
    methods=["GET"],
)
