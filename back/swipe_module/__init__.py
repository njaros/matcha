from flask import Blueprint
from flask_cors import CORS
from .routes import get_ten_randoms, \
                    like_user, \
                    dislike_user


app = Blueprint('swipe', __name__)
CORS(app)

app.add_url_rule(
    '/swipe/get_ten_randoms',
    'get_ten_random',
    get_ten_randoms,
    methods=["GET"])
app.add_url_rule(
    '/swipe/like_user',
    'like_user',
    like_user,
    methods=["POST"]
)
app.add_url_rule(
    '/swipe/dislike_user',
    'dislike_user',
    dislike_user,
    methods=["POST"]
)
