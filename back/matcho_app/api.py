import os
from auth import routes
import psycopg
from flask import Flask
from flask_cors import CORS


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


app = Flask(__name__)
conn = set_up_db()
app.config["SECRET"] = os.environ.get("SECRET", "this is a secret")


def main():

    routes.auth_routes(app)

    app.run(debug=True, host='0.0.0.0', port=port)


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5066))
    main()
