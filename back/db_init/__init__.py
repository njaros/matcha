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
    if (len(exists) == 0):
        cur.execute("""
            CREATE TABLE user_table (
                id uuid PRIMARY KEY,
                username VARCHAR,
                password VARCHAR,
                email VARCHAR,
                rank INT
            )
        """)

        cur.execute("""
            CREATE TABLE room (
                id uuid PRIMARY KEY,
                user_1 uuid,
                user_2 uuid,
                FOREIGN KEY (user_1) REFERENCES user_table(id),
                FOREIGN KEY (user_2) REFERENCES user_table(id)
            )
        """)

        cur.execute("""
            CREATE TABLE message (
                id serial PRIMARY KEY,
                content VARCHAR,
                sender_id uuid,
                send_at TIMESTAMP DEFAULT NOW(),
                room_id uuid,
                FOREIGN KEY (sender_id) REFERENCES user_table(id),
                FOREIGN KEY (room_id) REFERENCES room(id)
            )
        """)

        cur.execute("""
            CREATE TABLE relationship (
                id uuid PRIMARY KEY,
                liker_id VARCHAR,
                liked_id VARCHAR,
                FOREIGN KEY (liker_id) REFERENCES user_table(id),
                FOREIGN KEY (liked_id) REFERENCES user_table(id)
            )
        """)
        
        cur.execute("""
            CREATE TABLE photos (
                id uuid PRIMARY KEY,
                mime_type VARCHAR,
                binaries bytea,
                user_id uuid,
                FOREIGN KEY (user_id) REFERENCES user_table(id));
        """)

        cur.execute("""
            CREATE TABLE HOBBIES (
                id serial PRIMARY KEY,
                name VARCHAR
            )
        """)

        cur.close()
        db_conn.commit()
    return db_conn


db_conn = set_up_db()
