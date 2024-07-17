from cryptography.fernet import Fernet
import base64
import uuid
from flask import current_app as app
from psycopg.rows import dict_row

# -------------- PHOTOS ----------------


def insert_photos(**kwargs):
    hasher = Fernet(app.config["SECRET_PHOTO"])
    query = """
        INSERT INTO photos
        (id, mime_type, binaries, main, user_id)
        VALUES(%s, %s, %s, %s, %s);
        """
    start = 0
    cur = app.config["conn"].cursor()
    if kwargs["photo_count"] == 0:
        start += 1
        cur.executemany(
            query,
            [
                [
                    uuid.uuid1(),
                    elt[0],
                    hasher.encrypt(elt[2]),
                    True,
                    kwargs["user"]["id"],
                ]
                for elt in kwargs["accepted"][0:start]
            ],
        )
    cur.executemany(
        query,
        [
            [
                uuid.uuid1(),
                elt[0],
                hasher.encrypt(elt[2]),
                False,
                kwargs["user"]["id"],
            ]
            for elt in kwargs["accepted"][start:]
        ],
    )
    app.config["conn"].commit()
    cur.close()


def count_photos_by_user_id(user_id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
                SELECT COUNT(*) AS count
                FROM photos
                WHERE user_id = %s;
                """,
        (user_id,),
    )
    res = cur.fetchone()
    cur.close()
    return res["count"]


def get_photos_by_user_id(user_id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
                SELECT *
                FROM photos
                WHERE user_id = %s;
                """,
        (user_id,),
    )
    photos = cur.fetchall()
    if photos is None:
        cur.close()
        return None
    cur.close()
    return photos


def get_main_photo_by_user_id(user_id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT
                id,
                binaries,
                mime_type
            FROM photos
            WHERE photos.user_id = %s AND main = true
            """
    cur.execute(query, (user_id,))
    res = cur.fetchone()
    if res is None:
        return None
    hasher = Fernet(app.config["SECRET_PHOTO"])
    res["binaries"] = base64.b64encode(hasher.decrypt(res["binaries"])).decode("utf-8")
    cur.close()
    return res


def delete_photo_by_id(photo_id):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
                DELETE FROM photos
                WHERE id = %s
                RETURNING *;
                """,
        (photo_id,),
    )
    res = cur.fetchone()
    app.config["conn"].commit()
    cur.close()
    return res


def get_photos_by_id(photo_id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
                SELECT
                    photos.id AS id,
                    photos.mime_type AS mime_type,
                    photos.binaries AS binaries,
                    photos.main AS main,
                    photos.user_id AS user_id
                FROM photos
                WHERE id = %s
                """,
        (photo_id,),
    )
    res = cur.fetchone()
    cur.close()
    if res is None:
        return None
    return res


def set_a_main_photo(user_id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
                UPDATE photos
                SET main = TRUE
                WHERE id = (
                    SELECT id
                    FROM photos
                    WHERE user_id = %s
                    LIMIT 1
                )
                RETURNING id;
                """,
        (user_id,),
    )
    main_id = cur.fetchone()
    app.config["conn"].commit()
    cur.close()
    if main_id is None:
        return None
    return main_id


def change_main_photo_by_ids(current_main_id, future_main_id):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
                UPDATE photos
                SET main = FALSE
                WHERE id = %s;
                """,
        (current_main_id,),
    )
    cur.execute(
        """
                UPDATE photos
                SET main = TRUE
                WHERE id = %s;
                """,
        (future_main_id,),
    )
    app.config["conn"].commit()
    cur.close()


def has_photos(**kwargs):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
        SELECT COUNT (*)
        FROM photos
        WHERE user_id = %s
        """,
        (kwargs["user"]["id"],)
    )
    res = cur.fetchone()["count"]
    cur.close()
    return res


# -------------- BIOGRAPHY -----------------


def change_user_biography_by_id(**kwargs):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
                UPDATE user_table
                SET biography = %s
                WHERE id = %s;
                """,
        (kwargs["biography"], kwargs["user"]["id"]),
    )
    app.config["conn"].commit()
    cur.close()


def get_user_biography_by_id(**kwargs):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
                SELECT biography
                FROM user_table
                WHERE id = %s;
                """,
        (kwargs["user"]["id"],),
    )
    res = cur.fetchone()
    cur.close()
    if res in None:
        return ""
    return res


# --------------- UPDATE USER ---------------


def update_user(**kwargs):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
                UPDATE user_table
                SET username = COALESCE(%s, username),
                    email = COALESCE(%s, email),
                    gender = COALESCE(%s, gender),
                    biography = COALESCE(%s, biography),
                    preference = COALESCE(%s, preference)
                WHERE id = %s
                RETURNING   username,
                            email,
                            gender,
                            biography,
                            preference
                """,
        (
            kwargs["username"],
            kwargs["email"],
            kwargs["gender"],
            kwargs["biography"],
            kwargs["preference"],
            kwargs["user"]["id"],
        ),
    )
    user_updated = cur.fetchone()
    app.config["conn"].commit()
    cur.close()
    return user_updated


# ------------------- GPS ------------------


def update_gps(**kwargs):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
                UPDATE user_table
                SET latitude = %s,
                    longitude = %s
                where id = %s;
                """,
        (
            kwargs["gps"].latitude,
            kwargs["gps"].longitude,
            kwargs["user"]["id"],
        ),
    )
    app.config["conn"].commit()
    cur.close()


def lock_gps(**kwargs):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
                UPDATE user_table
                SET gpsfixed = true
                WHERE id = %s;
        """,
        (kwargs["user"]["id"],),
    )
    app.config["conn"].commit()
    cur.close()


def unlock_gps(**kwargs):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
                UPDATE user_table
                SET gpsfixed = false
                WHERE id = %s;
        """,
        (kwargs["user"]["id"],),
    )
    app.config["conn"].commit()
    cur.close()


# --------------------- HOBBIES ---------------------


def get_user_hobbies_yn(**kwargs):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
        SELECT  id, name,
        CASE
                WHEN id IN (SELECT hobbie_id
                            FROM user_hobbie
                            WHERE user_id = %s)
                THEN true
                ELSE false
        END AS  belong
        FROM    hobbie;
        """,
        (kwargs["user"]["id"],),
    )
    hobbies = cur.fetchall()
    cur.close()
    return hobbies


def get_user_hobbies(**kwargs):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
        SELECT  name
        FROM    hobbie
        WHERE   id IN (
            SELECT  hobbie_id
            FROM    user_hobbie
            WHERE   user_id = %s
        );
        """,
        (kwargs["user"]["id"],),
    )
    hobbies = cur.fetchone()
    cur.close()
    return hobbies


def get_hobbies():
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
        SELECT *
        FROM hobbie
        """
    )
    hobbies = cur.fetchall()
    cur.close()
    return hobbies


def add_user_hobbies(**kwargs):
    cur = app.config["conn"].cursor()
    query = """
            INSERT INTO user_hobbie (user_id, hobbie_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING;
            """
    cur.executemany(
        query,
        [(kwargs["user"]["id"], hobbie_id) for hobbie_id in kwargs["hobbie_ids"]],
    )
    app.config["conn"].commit()
    cur.close()


def delete_user_hobbies(**kwargs):
    cur = app.config["conn"].cursor()
    query = """
            DELETE FROM user_hobbie
            WHERE user_id = %s AND hobbie_id = %s;
            """
    cur.executemany(
        query,
        [(kwargs["user"]["id"], hobbie_id) for hobbie_id in kwargs["hobbie_ids"]],
    )
    app.config["conn"].commit()
    cur.close()


def get_userid_with_hobbies_ids(**kwargs):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
                SELECT  user_id
                FROM    user_hobbie
                WHERE   hobbie_id IN %s
                GROUP BY user_id
                HAVING COUNT(DISTINCT hobbie_id) = %s
                """,
        (kwargs["hobbie_ids"], len(kwargs["hobbie_ids"])),
    )
    user_ids = cur.fetchall()
    cur.close()
    return user_ids


def verify_pass(**kwargs):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
        SELECT *
        FROM user_table
        WHERE id = %s AND password = %s
        """,
        (kwargs["user"]["id"], kwargs["currentPassword"]),
    )
    user = cur.fetchone()
    if user is None:
        return False
    return True


def update_password_by_id(**kwargs):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
        UPDATE user_table
        SET password = %s
        WHERE id = %s;
        """,
        (
            kwargs["newPassword"],
            kwargs["user"]["id"],
        ),
    )
    app.config["conn"].commit()
    cur.close()
