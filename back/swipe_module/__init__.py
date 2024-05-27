from flask import Blueprint
from flask_cors import CORS
from .routes import like_user, \
                    dislike_user, \
                    get_swipe_list


app = Blueprint('swipe', __name__)
CORS(app)

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
app.add_url_rule(
    '/swipe/get_swipe_list',
    'get_swipe_list',
    get_swipe_list,
    methods=["POST"]
)
