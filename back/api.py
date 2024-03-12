from flask import Flask
from flask_cors import CORS
import psycopg
import os
from auth import routes


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


def main():
    app = Flask(__name__)
    CORS(app)
    conn = set_up_db()

    routes.auth_routes(app, conn)

    @app.route("/")
    def home():
        return "you are at home"

    @app.route("/leave")
    def leave():
        return "you leaved home"

    @app.route("/helloworld")
    def hello():
        return "hello world"

    app.run(debug=True, host='0.0.0.0', port=port)


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5066))
    main()
