import os
import psycopg
from psycopg.rows import dict_row


def set_up_db():
    db_conn = psycopg.connect(
        dbname=os.environ.get("POSTGRES_DB"),
        host=os.environ.get("POSTGRES_IP"),
        user=os.environ.get("POSTGRES_USER"),
        password=os.environ.get("POSTGRES_PASSWORD"),
    )
    cur = db_conn.cursor()
    cur.execute(
        "select relname from pg_class where relkind='r'\
        and relname !~ '^(pg_|sql_)';"
    )
    exists = cur.fetchall()
    if len(exists) == 0:
        cur.execute(
            """
            CREATE TABLE user_table (
                id uuid PRIMARY KEY,
                username VARCHAR,
                password VARCHAR,
                email VARCHAR,
                birthDate DATE,
                gender VARCHAR,
                preference VARCHAR,
                biography VARCHAR,
                rank INT,
                latitude real,
                longitude real,
                gpsfixed boolean not null default false
            )
        """
        )

        cur.execute(
            """
            CREATE TABLE room (
                id uuid PRIMARY KEY,
                user_1 uuid,
                user_2 uuid,
                FOREIGN KEY (user_1) REFERENCES user_table(id),
                FOREIGN KEY (user_2) REFERENCES user_table(id)
            )
        """
        )

        cur.execute(
            """
            CREATE TABLE message (
                id serial PRIMARY KEY,
                content VARCHAR,
                sender_id uuid,
                send_at TIMESTAMP DEFAULT NOW(),
                room_id uuid,
                FOREIGN KEY (sender_id) REFERENCES user_table(id),
                FOREIGN KEY (room_id) REFERENCES room(id)
            )
        """
        )

        cur.execute(
            """
            CREATE TABLE relationship (
                id uuid PRIMARY KEY,
                liker_id uuid,
                liked_id uuid,
                FOREIGN KEY (liker_id) REFERENCES user_table(id),
                FOREIGN KEY (liked_id) REFERENCES user_table(id)
            )
        """
        )

        cur.execute(
            """
            CREATE TABLE photos (
                id uuid PRIMARY KEY,
                mime_type VARCHAR,
                binaries bytea,
                main boolean,
                user_id uuid,
                FOREIGN KEY (user_id) REFERENCES user_table(id)
                ON DELETE CASCADE);
        """
        )

        cur.execute(
            """
            CREATE TABLE hobbie (
                id serial PRIMARY KEY,
                name VARCHAR
            )
        """
        )

        cur.execute(
            """
            CREATE TABLE user_hobbie (
                user_id uuid REFERENCES user_table(id) ON DELETE CASCADE,
                hobbie_id INT REFERENCES hobbie(id) ON DELETE CASCADE,
                CONSTRAINT user_hobbie_pk PRIMARY KEY(user_id, hobbie_id)
            );
        """
        )

        cur.execute(
            """
            INSERT INTO hobbie (name)
            VALUES  ('coder matcha'),
                    ('voiture'),
                    ('musique'),
                    ('le foute'),
                    ('sport'),
                    ('manger'),
                    ('alcool'),
                    ('film'),
                    ('series'),
                    ('les guns'),
                    ('jeux videos'),
                    ('poney');
            """
        )

        cur.close()
        db_conn.commit()
    return db_conn


db_conn = set_up_db()
