from flask import Flask
from flask_cors import CORS
from flask_mail import Mail, Message
from cryptography.fernet import Fernet
import os
from extensions import socketio
from mail_config import Config as Mail_config
from werkzeug.exceptions import BadRequestKeyError
from error_status.error import BadRequestError, \
    InternalServerError, \
    NotFoundError, \
    ForbiddenError, \
    RequestTooLargeError, \
    handle_miss_key_error, \
    handle_bad_request_error, \
    handle_internal_server_error, \
    handle_not_found_error, \
    handle_forbidden_error, \
    handle_miss_key_error_internal, \
    handle_value_error, \
    handle_request_too_large_error

# create primary Flask app

app = Flask(__name__)
app.config['SECRET_ACCESS'] = os.environ.get('SECRET_ACCESS')
app.config['SECRET_REFRESH'] = os.environ.get('SECRET_REFRESH')
app.config['MAIL_ADDRESS'] = os.environ.get('MATCHA_MAIL')
app.config['MAIL_ADDRESS_PASS'] = os.environ.get('MATCHA_MAIL_PASS')
app.config['SECRET_EMAIL_TOKEN'] = os.environ.get('SECRET_EMAIL_TOKEN')
app.config['MAX_CONTENT_LENGTH'] = 16000000
app.config.from_object(Mail_config)
app.config['UPLOAD_FOLDER'] = '/app/imgs/'
app.config['IMG_EXT'] = set(['png', 'jpg', 'jpeg', 'gif'])
if os.path.exists("/app/photo.key"):
    file_key = open("/app/photo.key", "rb")
    key = file_key.read()
else:
    key = Fernet.generate_key()
    file_key = open("/app/photo.key", "wb")
    file_key.write(key)
file_key.close()
app.config['SECRET_PHOTO'] = key

CORS(app, origins='*')
app.config['mail'] = Mail(app)

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
from user_module import app as user_module
from swipe_module import app as swipe_module

app.register_blueprint(login_module)
app.register_blueprint(socket_app)
app.register_blueprint(jwt_module)
app.register_blueprint(chat_module)
app.register_blueprint(app3)
app.register_blueprint(profile_module)
app.register_blueprint(relationship_module)
app.register_blueprint(user_module)
app.register_blueprint(swipe_module)

# error management

app.register_error_handler(BadRequestError, handle_bad_request_error)
app.register_error_handler(InternalServerError, handle_internal_server_error)
app.register_error_handler(InternalServerError, handle_not_found_error)
app.register_error_handler(ForbiddenError, handle_forbidden_error)
app.register_error_handler(NotFoundError, handle_not_found_error)
app.register_error_handler(BadRequestKeyError, handle_miss_key_error)
app.register_error_handler(KeyError, handle_miss_key_error_internal)
app.register_error_handler(ValueError, handle_value_error)
app.register_error_handler(RequestTooLargeError, handle_request_too_large_error)

if __name__ == "__main__":
    port = int(os.environ.get('SERVER_PORT'))
    socketio.run(app,
                 host='0.0.0.0',
                 port=5066,
                 debug=True,
                 allow_unsafe_werkzeug=True)
