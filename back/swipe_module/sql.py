from db_init import db_conn as conn
from psycopg.rows import dict_row
from flask import current_app
from chat import sql as chat_sql
import uuid


def get_random_list_ten(**kwargs):
    user = kwargs["user"]["id"]
    cur = conn.cursor(row_factory=dict_row)
    cur.execute(
        """
                SELECT user_table.id, username, \
                    birthDate, gender, photos.binaries, \
                    photos.mime_type
                FROM user_table
                LEFT OUTER JOIN photos ON user_table.id = photos.user_id \
                    AND photos.main = true
                WHERE user_table.id NOT IN (
                    SELECT canceler_id
                    FROM cancel
                    WHERE canceled_id = %s
                ) AND user_table.id NOT IN (
                    SELECT canceled_id
                    FROM cancel
                    WHERE canceler_id = %s
                ) AND user_table.id NOT IN (
                    SELECT liked_id
                    FROM relationship
                    WHERE liker_id = %s
                ) AND user_table.id NOT IN ( %s )
                LIMIT 10;
        """,
        (user, user, user, user),
    )
    swipe_list = cur.fetchall()
    cur.close()
    return swipe_list


def like_user(**kwargs):
    cur = conn.cursor()
    new_room = None
    cur.execute(
        """
        SELECT id
        FROM relationship
        WHERE liker_id = %s AND liked_id = %s;
        """,
        (kwargs["user"]["id"], kwargs["target_id"]),
    )
    if cur.fetchone() is not None:
        cur.close()
        return
    cur.execute(
        """
        INSERT INTO relationship (id, liker_id, liked_id)
        VALUES (%s, %s, %s);
        """,
        (uuid.uuid1(), kwargs["user"]["id"], kwargs["target_id"]),
    )
    cur.execute(
        """
        SELECT id
        FROM relationship
        WHERE liker_id = %s AND liked_is = %s;
        """,
        (kwargs["target_id"], kwargs["user"]["id"]),
    )
    if cur.fetchone() is not None:
        new_room = chat_sql.insert_room(
            {
                "user_id1": kwargs["user"]["id"],
                "user_id2": kwargs["target_id"],
            }
        )
    conn.commit()
    cur.close()
    return new_room
