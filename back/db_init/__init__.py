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
            id uuid PRIMARY KEY,\
            username VARCHAR,\
            password VARCHAR,\
            email VARCHAR,\
            rank INT);")

        cur.execute("CREATE TABLE message (\
            id serial PRIMARY KEY,\
            content VARCHAR,\
            user_id_sender VARCHAR,\
            user_id_receiver VARCHAR,\
            time TIMESTAMP);")

        cur.execute("CREATE TABLE photos (\
            id uuid PRIMARY KEY,\
            path VARCHAR,\
            user_id VARCHAR);")

        cur.execute("CREATE TABLE relationship (\
            id uuid  PRIMARY KEY,\
            user_id_1 VARCHAR,\
            user_id_2 VARCHAR,\
            status VARCHAR);")

        cur.execute("CREATE TABLE HOBBIES (\
            id serial PRIMARY KEY,\
            name VARCHAR);")
        
        cur.close()
        db_conn.commit()
    return db_conn


db_conn = set_up_db()
