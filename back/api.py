from flask import Flask
from flask_cors import CORS
import os
from extensions import socketio
from error_status.error import *

# create primary Flask app

app = Flask(__name__)
app.config['SECRET_ACCESS'] = os.environ.get('SECRET_ACCESS')
app.config['SECRET_REFRESH'] = os.environ.get('SECRET_REFRESH')
app.config['MAX_CONTENT_LENGTH'] = 16000000
app.config['UPLOAD_FOLDER'] = '/app/imgs/'
app.config['IMG_EXT'] = set(['png', 'jpg', 'jpeg', 'gif'])

CORS(app, origins='*')


# initialization of Flask-SocketIO

socketio.init_app(app)

# import and save sub-app

from login_module import app as login_module
from socket_app import app as socket_app
from chat import app as chat_module
from jwt_policy import app as jwt_module
from token_required_test_module import app as app3
from profile_module import app as profile_module
from relationship import app as relationship_module

app.register_error_handler(BadRequestError, handle_bad_request_error)
app.register_error_handler(InternalServerError, handle_internal_server_error)
app.register_blueprint(login_module)
app.register_blueprint(socket_app)
app.register_blueprint(jwt_module)
app.register_blueprint(chat_module)
app.register_blueprint(app3)
app.register_blueprint(profile_module)
app.register_blueprint(relationship_module)


if __name__ == "__main__":
    port = int(os.environ.get('SERVER_PORT'))
    socketio.run(app, host='0.0.0.0', port=5066, debug=True, allow_unsafe_werkzeug=True)
