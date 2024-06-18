from flask import Blueprint
from .routes import (
    upload,
    delete_photo,
    get_photos,
    change_biography,
    change_main_photo,
    update_user,
    set_pos,
    lock_gps,
    unlock_gps,
    get_hobbies,
    get_self_hobbies,
    add_hobby,
    del_hobby,
    change_password
)
from flask_cors import CORS


app = Blueprint("profile", __name__)
CORS(app)


app.add_url_rule("/profile/upload", "upload", upload, methods=["POST"])
app.add_url_rule(
    "/profile/get_photos", "get_photos", get_photos, methods=["GET"]
)
app.add_url_rule(
    "/profile/delete_photo", "delete_photo", delete_photo, methods=["POST"]
)
app.add_url_rule(
    "/profile/change_main_photo",
    "change_main_photo",
    change_main_photo,
    methods=["POST"],
)
app.add_url_rule(
    "/profile/change_biography",
    "change_biography",
    change_biography,
    methods=["POST"],
)
app.add_url_rule(
    "/profile/update_user", "update_user", update_user, methods=["POST"]
)
app.add_url_rule("/profile/set_pos", "set_pos", set_pos, methods=["POST"])
app.add_url_rule("/profile/lock_gps", "lock_gps", lock_gps, methods=["GET"])
app.add_url_rule(
    "/profile/unlock_gps", "unlock_gps", unlock_gps, methods=["GET"]
)
app.add_url_rule(
    "/profile/get_self_hobbies",
    "get_self_hobbies",
    get_self_hobbies,
    methods=["GET"],
)
app.add_url_rule(
    "/profile/add_hobby", "add_hobby", add_hobby, methods=["POST"]
)
app.add_url_rule(
    "/profile/del_hobby", "del_hobby", del_hobby, methods=["POST"]
)
app.add_url_rule(
    "/profile/get_hobbies", "get_hobbies", get_hobbies, methods=["GET"]
)
app.add_url_rule(
    "/profile/change_password", "change_password", change_password, methods=["POST"]
)
