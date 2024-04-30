from db_init import db_conn as conn
import uuid
from psycopg.rows import dict_row
from flask import current_app


def insert_new_user_in_database(sign_data):
    cur = conn.cursor()
    cur.execute(
                "INSERT INTO user_table (id, \
                    username, \
                    password, \
                    email, \
                    birthdate, \
                    gender, \
                    preference, \
                    biography, \
                    rank)\
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);",
                (uuid.uuid1(),
                 sign_data.get("username"),
                 sign_data.get("password"),
                 sign_data.get("email"),
                 sign_data.get("birthDate"),
                 sign_data.get("gender"),
                 sign_data.get("preference"),
                 sign_data.get("biography"),
                 0))
    conn.commit()
    cur.close()


def login_user_in_database(kwargs):
    cur = conn.cursor(row_factory=dict_row)
    cur.execute(
        """
        UPDATE user_table
        SET latitude = CASE WHEN gpsfixed = false THEN COALESCE(%s, latitude)
                            ELSE latitude
                            END,
            longitude = CASE WHEN gpsfixed = false THEN COALESCE(%s, longitude)
                            ELSE longitude
                            END
        WHERE username = %s AND password = %s
        RETURNING *;
        """,
        (kwargs.get("latitude"),
         kwargs.get("longitude"),
         kwargs.get("username"),
         kwargs.get("password"),)
    )
    user = cur.fetchone()
    if user is None:
        cur.close()
        return None
    conn.commit()
    cur.close()
    kwargs["user"] = user


def update_gps_loc_by_id(kwargs):
    cur = conn.cursor()
    current_app.logger.info(kwargs)
    cur.execute(
        """
        UPDATE user_table
        SET latitude = %s,
            longitude = %s
        WHERE id = %s;
        """,
        (kwargs["latitude"], kwargs["longitude"], kwargs["id"])
    )
    conn.commit()
    cur.close()
