import os
import psycopg
from .db_filler import insert_users_in_database
import uuid
import hashlib
import time
from flask import current_app


def set_up_db():
    connected = False
    while (connected is False):
        retry = False
        try:
            db_conn = psycopg.connect(
                dbname=os.environ.get("POSTGRES_DB"),
                host=os.environ.get("POSTGRES_IP"),
                user=os.environ.get("POSTGRES_USER"),
                password=os.environ.get("POSTGRES_PASSWORD"),
            )
        except psycopg.OperationalError:
            retry = True
            time.sleep(3)
        if retry is False:
            connected = True
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
                email_verified bool not null default false,
                birthDate DATE,
                gender VARCHAR,
                preference VARCHAR,
                biography VARCHAR,
                rank INT,
                latitude real,
                longitude real,
                gpsfixed boolean not null default false,
                last_connection TIMESTAMP DEFAULT NOW()
            )
        """
        )

        cur.execute(
            """
            CREATE TABLE room (
                id uuid PRIMARY KEY,
                user_1 uuid,
                user_2 uuid,
                FOREIGN KEY (user_1) REFERENCES user_table(id) \
                    ON DELETE CASCADE,
                FOREIGN KEY (user_2) REFERENCES user_table(id) \
                    ON DELETE CASCADE
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
                FOREIGN KEY (sender_id) REFERENCES user_table(id) \
                    ON DELETE CASCADE,
                FOREIGN KEY (room_id) REFERENCES room(id) \
                    ON DELETE CASCADE
            )
        """
        )

        cur.execute(
            """
            CREATE TABLE relationship (
                id uuid PRIMARY KEY,
                liker_id uuid,
                liked_id uuid,
                FOREIGN KEY (liker_id) REFERENCES user_table(id)
                    ON DELETE CASCADE,
                FOREIGN KEY (liked_id) REFERENCES user_table(id)
                    ON DELETE CASCADE
            )
        """
        )

        cur.execute(
            """
            CREATE TABLE cancel (
                id uuid PRIMARY KEY,
                canceler_id uuid,
                canceled_id uuid,
                FOREIGN KEY (canceler_id) REFERENCES user_table(id) \
                    ON DELETE CASCADE,
                FOREIGN KEY (canceled_id) REFERENCES user_table(id) \
                    ON DELETE CASCADE
            );
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
            CREATE TABLE report (
                reported_id uuid REFERENCES user_table(id) ON DELETE CASCADE,
                reporter_id uuid REFERENCES user_table(id) ON DELETE CASCADE,
                CONSTRAINT report_pk PRIMARY KEY(reported_id, reporter_id)
            );
            """
        )

        cur.execute(
            """
            CREATE TABLE visits (
                id serial PRIMARY KEY,
                visitor_id uuid REFERENCES user_table(id) ON DELETE CASCADE,
                visited_id uuid REFERENCES user_table(id) ON DELETE CASCADE,
                at TIMESTAMP DEFAULT NOW()
            )
            """
        )

        cur.execute(
            """
            CREATE TABLE unread_msg (
                id serial PRIMARY KEY,
                user_id uuid,
                room_id uuid,
                count   integer default 0,
                FOREIGN KEY (user_id) REFERENCES user_table(id)
                    ON DELETE CASCADE,
                FOREIGN KEY (room_id) REFERENCES room(id)
                    ON DELETE CASCADE
            );
            """
        )

        cur.execute(
            """
            INSERT INTO hobbie (name)
            VALUES  ('car'),
                    ('music'),
                    ('football'),
                    ('sport'),
                    ('eating'),
                    ('books'),
                    ('films'),
                    ('series'),
                    ('hangout'),
                    ('coding matcha'),
                    ('video games'),
                    ('dog'),
                    ('cat'),
                    ('rock climbing'),
                    ('lead climbing'),
                    ('speed climbing'),
                    ('ice climbing'),
                    ('hiking'),
                    ('cooking'),
                    ('trip'),
                    ('carpe diem'),
                    ('tattoo'),
                    ('piercing'),
                    ('vegan'),
                    ('carnivorous'),
                    ('politic'),
                    ('manga'),
                    ('anime'),
                    ('nature'),
                    ('biking'),
                    ('painting'),
                    ('DIY'),
                    ('art'),
                    ('gym'),
                    ('running'),
                    ('tennis'),
                    ('capybara'),
                    ('sleeping'),
                    ('astrology')
                    ;
            """
        )

        # USER TEST INSERTION

        cur.execute(
            """
            INSERT INTO user_table \
            (id, username, password, email, email_verified, birthDate, \
            gender, preference, biography, rank, latitude, \
            longitude, gpsfixed)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                uuid.uuid1(),
                "jeremy",
                hashlib.sha256("mdp".encode("utf-8")).hexdigest(),
                "jeremy@jeremy.fr",
                True,
                "2000-11-20",
                "man",
                "all",
                "",
                10,
                48.866667,
                2.333333,
                False,
            ),
        )

        cur.execute(
            """
            INSERT INTO user_table \
            (id, username, password, email, email_verified, birthDate, \
            gender, preference, biography, rank, latitude, \
            longitude, gpsfixed)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                uuid.uuid1(),
                "nico",
                hashlib.sha256("mdp".encode("utf-8")).hexdigest(),
                "nico@nico.fr",
                True,
                "2000-11-20",
                "man",
                "all",
                "",
                10,
                48.866667,
                2.333333,
                False,
            ),
        )

        cur.execute(
            """
            INSERT INTO user_table \
            (id, username, password, email, email_verified, birthDate, \
            gender, preference, biography, rank, latitude, \
            longitude, gpsfixed)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                uuid.uuid1(),
                "max",
                hashlib.sha256("mdp".encode("utf-8")).hexdigest(),
                "max@max.fr",
                True,
                "2000-11-20",
                "man",
                "all",
                "",
                10,
                48.866667,
                2.333333,
                False,
            ),
        )

        # USER TEST INSERTION

        insert_users_in_database(db_conn, 500, 45.783329, 4.73333)
        cur.close()
        db_conn.commit()
    return db_conn
