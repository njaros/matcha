from flask import Flask
from flask_restful import Resource
from flask_cors import CORS
import psycopg
import os
from auth import routes
from db_init import set_up_db
from extensions import socketio

# create primary Flask app

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET')
CORS(app, origins='http://127.0.0.1:8000')
conn = set_up_db()


# initialization of Flask-SocketIO

socketio.init_app(app)

# import and save sub-app 

from app1 import app as app1
from app2 import app as app2

app.register_blueprint(app1)
app.register_blueprint(app2)


if __name__ == "__main__":
    port = int(os.environ.get('SERVER_PORT'))
    socketio.run(app, host='0.0.0.0', port=5066, debug=True, allow_unsafe_werkzeug=True)
