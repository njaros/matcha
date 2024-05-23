from flask import Blueprint
from flask_cors import CORS
from .routes import (
    get_user_with_room,
    get_user_with_room_and_message,
    get_user_by_username,
    get_user_by_id,
    get_gps,
    get_me,
    get_user_profile,
    visite_profile,
)

app = Blueprint("user", __name__)
CORS(app)

app.add_url_rule(
    "/user/get_user_by_id", "get_user_by_id", get_user_by_id, methods=["GET"]
)
app.add_url_rule(
    "/user/get_user_by_username",
    "get_user_by_username",
    get_user_by_username,
    methods=["GET"],
)
app.add_url_rule(
    "/user/get_user_with_room",
    "get_user_with_room",
    get_user_with_room,
    methods=["GET"],
)
app.add_url_rule(
    "/user/get_user_with_room_and_message",
    "get_user_with_room_and_message",
    get_user_with_room_and_message,
    methods=["GET"],
),
app.add_url_rule("/user/get_me", "get_me", get_me, methods=["GET"])
app.add_url_rule("/user/get_gps", "get_gps", get_gps, methods=["GET"])
app.add_url_rule(
    "/user/get_user_profile",
    "get_user_profile",
    get_user_profile,
    methods=["POST"],
)
app.add_url_rule(
    "/user/visite_profile", "visite_profile", visite_profile, methods=["POST"]
)
