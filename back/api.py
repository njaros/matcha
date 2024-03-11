from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS
import psycopg
import os


def main():
    app = Flask(__name__)
    CORS(app)
    api = Api(app)
    print(f"{os.environ.get('POSTGRES_DB')=},\
            {os.environ.get('POSTGRES_IP')=},\
            {os.environ.get('POSTGRES_USER')=},\
            {os.environ.get('POSTGRES_PASSWORD')=}")
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
        cur.execute("CREATE TABLE user_table (id serial PRIMARY KEY,\
            name varchar);")
        cur.execute("INSERT INTO user_table (name) VALUES ('Mich');")
        cur.execute("SELECT * FROM user_table;")
        print(cur.fetchall())
        cur.close()
        conn.commit()
    conn.close()
    api.add_resource(HelloWorld, "/helloworld")
    api.add_resource(Home, "/")
    api.add_resource(Leave, "/leave")
    api.add_resource(Name, "/<string:name>")
    app.run(debug=True, host='0.0.0.0', port=port)


class HelloWorld(Resource):
    def get(self):
        return "hello world"


class Home(Resource):
    def get(self):
        return "you are at home"


class Leave(Resource):
    def get(self):
        return "you leaved home"


class Name(Resource):
    def get(self, name):
        return f"Hello, {name}"


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5066))
    main()
