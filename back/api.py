from flask import Flask
from flask_restful import Resource
from flask_cors import CORS
import psycopg
import os
from auth import routes
from extensions import socketio


def set_up_db():
    conn = psycopg.connect(
        dbname=os.environ.get("POSTGRES_DB"),
        host=os.environ.get("POSTGRES_IP"),
        user=os.environ.get("POSTGRES_USER"),
        password=os.environ.get("POSTGRES_PASSWORD"))
    cur = conn.cursor()
    cur.execute("select relname from pg_class where relkind='r'\
        and relname !~ '^(pg_|sql_)';")
    exists = cur.fetchall()
    print(exists)
    if (len(exists) == 0):
        cur.execute("CREATE TABLE user_table (\
            id serial PRIMARY KEY,\
            name varchar,\
            password varchar,\
            email varchar);")
        cur.close()
        conn.commit()
    return conn


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
