from db_init import db_conn as conn
from cryptography.fernet import Fernet
import uuid
from flask import current_app as app
from psycopg.rows import dict_row

# -------------- PHOTOS ----------------


def insert_photos(**kwargs):
    hasher = Fernet(app.config['SECRET_PHOTO'])
    query = """
        INSERT INTO photos
        (id, mime_type, binaries, main, user_id)
        VALUES(%s, %s, %s, %s, %s);
        """
    start = 0
    cur = conn.cursor()
    if kwargs["photo_count"] == 0:
        start += 1
        cur.executemany(query, [[uuid.uuid1(),
                                elt[0],
                                hasher.encrypt(elt[2]),
                                True,
                                kwargs["user"]["id"]]
                                for elt in kwargs["accepted"][0:start]])
    cur.executemany(query, [[uuid.uuid1(),
                            elt[0],
                            hasher.encrypt(elt[2]),
                            False,
                            kwargs["user"]["id"]]
                            for elt in kwargs["accepted"][start:]])
    conn.commit()
    cur.close()


def count_photos_by_user_id(user_id):
    cur = conn.cursor(row_factory=dict_row)
    cur.execute("""
                SELECT COUNT(*) AS count
                FROM photos
                WHERE user_id = %s;
                """,
                (user_id,))
    res = cur.fetchone()
    cur.close()
    return res['count']


def get_photos_by_user_id(user_id):
    cur = conn.cursor(row_factory=dict_row)
    cur.execute("""
                SELECT *
                FROM photos
                WHERE user_id = %s;
                """,
                (user_id,))
    photos = cur.fetchall()
    if photos is None:
        return None
    cur.close()
    return photos


def delete_photo_by_id(photo_id):
    cur = conn.cursor()
    cur.execute("""
                DELETE FROM photos
                WHERE id = %s
                RETURNING *;
                """,
                (photo_id,))
    res = cur.fetchone()
    conn.commit()
    cur.close()
    return res


def get_photos_by_id(photo_id):
    cur = conn.cursor(row_factory=dict_row)
    cur.execute("""
                SELECT
                    photos.id AS id,
                    photos.mime_type AS mime_type,
                    photos.binaries AS binaries,
                    photos.main AS main,
                    photos.user_id AS user_id
                FROM photos
                WHERE id = %s
                """,
                (photo_id,))
    res = cur.fetchone()
    cur.close()
    if res is None:
        return None
    return res


def set_a_main_photo(user_id):
    cur = conn.cursor(row_factory=dict_row)
    cur.execute("""
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
                (user_id,))
    main_id = cur.fetchone()
    conn.commit()
    cur.close()
    if main_id is None:
        return None
    return main_id


def change_main_photo_by_ids(current_main_id, future_main_id):
    cur = conn.cursor()
    cur.execute("""
                UPDATE photos
                SET main = FALSE
                WHERE id = %s;
                """,
                (current_main_id,))
    cur.execute("""
                UPDATE photos
                SET main = TRUE
                WHERE id = %s;
                """,
                (future_main_id,))
    conn.commit()
    cur.close()


# -------------- BIOGRAPHY -----------------


def change_user_biography_by_id(**kwargs):
    cur = conn.cursor()
    cur.execute("""
                UPDATE user_table
                SET biography = %s
                WHERE id = %s;
                """,
                (kwargs["biography"], kwargs["user"]["id"]))
    conn.commit()
    cur.close()


def get_user_biography_by_id(**kwargs):
    cur = conn.cursor(row_factory=dict_row)
    cur.execute("""
                SELECT biography
                FROM user_table
                WHERE id = %s;
                """,
                (kwargs["user"]["id"],))
    res = cur.fetchone()
    cur.close()
    if res in None:
        return ""
    return res


# --------------- UPDATE USER ---------------


def update_user(**kwargs):
    cur = conn.cursor(row_factory=dict_row)
    cur.execute("""
                UPDATE user_table
                SET username = COALESCE(%s, username),
                    email = COALESCE(%s, email),
                    birthDate = COALESCE(%s, birthDate),
                    gender = COALESCE(%s, gender),
                    biography = COALESCE(%s, biography),
                    preference = COALESCE(%s, preference)
                WHERE id = %s
                RETURNING   username,
                            email,
                            birthdate,
                            gender,
                            biography,
                            preference
                """,
                (kwargs["username"], kwargs["email"], kwargs["birthDate"],
                 kwargs["gender"], kwargs["biography"], kwargs["preference"],
                 kwargs["user"]["id"]))
    user_updated = cur.fetchone()
    conn.commit()
    cur.close()
    return user_updated
