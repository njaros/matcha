from db_init import db_conn as conn
import uuid
from error_status.error import ForbiddenError, NotFoundError
import copy
from psycopg.rows import dict_row
from flask import current_app


def insert_new_user_in_database(sign_data):
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO user_table (id, \
                    username, \
                    password, \
                    email, \
                    birthdate, \
                    gender, \
                    preference, \
                    biography, \
                    rank)\
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """,
        (
            uuid.uuid1(),
            sign_data.get("username"),
            sign_data.get("password"),
            sign_data.get("email"),
            sign_data.get("birthDate"),
            sign_data.get("gender"),
            sign_data.get("preference"),
            sign_data.get("biography"),
            0,
        ),
    )
    conn.commit()
    id = cur.fetchone()
    cur.close()
    return id


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
        WHERE email = %s AND password = %s
        RETURNING *;
        """,
        (
            kwargs.get("latitude"),
            kwargs.get("longitude"),
            kwargs.get("email"),
            kwargs.get("password"),
        ),
    )
    user = cur.fetchone()
    kwargs["user"] = user
    if user is None:
        cur.close()
        return None
    if user["email_verified"] is False:
        return 1
    conn.commit()
    cur.close()
    return 0


def update_gps_loc_by_id(**kwargs):
    cur = conn.cursor()
    current_app.logger.info(kwargs)
    cur.execute(
        """
        UPDATE user_table
        SET latitude = %s,
            longitude = %s
        WHERE id = %s;
        """,
        (
            kwargs["user"]["latitude"],
            kwargs["user"]["longitude"],
            kwargs["user"]["id"],
        ),
    )
    conn.commit()
    cur.close()


def activate_mail_account(**kwargs):
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE user_table
        SET email_verified = true
        WHERE id = %s;
        """,
        (kwargs["user"]["id"],)
    )
    conn.commit()
    cur.close()


def update_password_by_email(**kwargs):
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE user_table
        SET password = %s
        WHERE email = %s;
        """,
        (kwargs["new_pass"], kwargs["email"],)
    )
    conn.commit()
    cur.close()


def get_user_by_email(**kwargs):
    cur = conn.cursor(row_factory=dict_row)
    cur.execute(
        """
        SELECT *
        FROM user_table
        WHERE email = %s;
        """,
        (kwargs["email"],)
    )
    user = cur.fetchone()
    if user is None:
        raise NotFoundError("user not found")
    return user
