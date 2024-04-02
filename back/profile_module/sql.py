from db_init import db_conn as conn
import uuid
from flask import current_app as app


def insert_photos(**kwargs):
    query = """
        INSERT INTO photos
        (id, mime_type, binaries, user_id)
        VALUES(%s, %s, %s, %s);
        """
    cur = conn.cursor()
    cur.executemany(query, [[uuid.uuid1(),
                             elt[0],
                             elt[2],
                             kwargs["user"]["id"]]
                             for elt in kwargs["accepted"]])
    conn.commit()
    cur.close()


def count_photos_by_user_id(user_id):
    cur = conn.cursor()
    cur.execute("""
                SELECT COUNT(*)
                FROM photos
                WHERE user_id = %s;
                """,
                (user_id,))
    count = cur.fetchone()[0]
    cur.close()
    return count


def get_photos_by_user_id(user_id):
    cur = conn.cursor()
    cur.execute("""
                SELECT *
                FROM photos
                WHERE user_id = %s;
                """,
                (user_id,))
    photos = cur.fetchall()
    cur.close()
    return photos


def delete_photo(user_id, photo_id):
    cur = conn.cursor()
    cur.execute("""
                DELETE FROM photos
                WHERE id = %s
                AND user_id = %s;
                """,
                (photo_id, user_id))
    res = cur.fetchone()
    cur.close()
    return res