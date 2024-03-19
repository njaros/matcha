import os
import psycopg


def set_up_db():
    db_conn = psycopg.connect(
        dbname=os.environ.get("POSTGRES_DB"),
        host=os.environ.get("POSTGRES_IP"),
        user=os.environ.get("POSTGRES_USER"),
        password=os.environ.get("POSTGRES_PASSWORD"))
    cur = db_conn.cursor()
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
        cur.execute("CREATE TABLE message (\
            id serial PRIMARY KEY,\
            content varchar,\
            author varchar,\
            time varchar);")
        cur.close()
        db_conn.commit()
    return db_conn


db_conn = set_up_db()
