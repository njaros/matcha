from flask import Flask
from flask_restful import Resource
from flask_cors import CORS
import os
from extensions import socketio

# create primary Flask app

app = Flask(__name__)
app.config['SECRET_ACCESS'] = os.environ.get('SECRET_ACCESS')
app.config['SECRET_REFRESH'] = os.environ.get('SECRET_REFRESH')
CORS(app, origins='*')


# initialization of Flask-SocketIO

socketio.init_app(app)

# import and save sub-app 

from login_module import app as login_module
from jwt_policy import app as jwt_module
from app2 import app as app2

app.register_blueprint(login_module)
app.register_blueprint(jwt_module)
app.register_blueprint(app2)


if __name__ == "__main__":
    port = int(os.environ.get('SERVER_PORT'))
    socketio.run(app, host='0.0.0.0', port=5066, debug=True, allow_unsafe_werkzeug=True)
