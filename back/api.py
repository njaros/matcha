from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS
from markupsafe import escape
import psycopg2
import os

app = Flask(__name__)
CORS(app)
api = Api(app)
conn = psycopg2.connect(dbname="users",
                        host="db_container",
                        user=os.environ.get("POSTGRES_USER"),
                        password=os.environ.get("POSTGRES_PASSWORD"))


class HelloWorld(Resource):
    def get(self):
        return "hello world"


@app.route("/")
def home():
    return "you are at home"


@app.route("/leave")
def leave():
    return "you leaved home"


@app.route("/<name>")
def hello(name):
    return f"Hello, {escape(name)}"


api.add_resource(HelloWorld, "/helloworld")

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5066))
    app.run(debug=True, host='0.0.0.0', port=port)
