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
    cur = conn.cursor(row_factory=dict_row)
    user = kwargs["user"]["id"]
    target = kwargs["target_id"]
    new_room = None
    cur.execute(
        """
        SELECT id
        FROM relationship
        WHERE liker_id = %s AND liked_id = %s;
        """,
        (user, target),
    )
    if cur.fetchone() is not None:
        cur.close()
        return
    cur.execute(
        """
        SELECT id
        FROM cancel
        WHERE   canceler_id = %s AND canceled_id = %s
                OR canceler_id = %s AND canceled_id = %s;
        """,
        (
            user,
            target,
            target,
            user,
        ),
    )
    if cur.fetchone() is not None:
        cur.close()
        return
    cur.execute(
        """
        INSERT INTO relationship (id, liker_id, liked_id)
        VALUES (%s, %s, %s);
        """,
        (uuid.uuid1(), user, target),
    )
    cur.execute(
        """
        SELECT id
        FROM relationship
        WHERE liker_id = %s AND liked_id = %s;
        """,
        (target, user),
    )
    if cur.fetchone() is not None:
        new_room = chat_sql.insert_room(
            {
                "user_id1": user,
                "user_id2": target,
            }
        )
    conn.commit()
    cur.close()
    return new_room


def dislike_user(**kwargs):
    cur = conn.cursor()
    user = kwargs["user"]["id"]
    target = kwargs["target_id"]
    cur.execute(
        """
        SELECT id
        FROM cancel
        WHERE   canceler_id = %s AND canceled_id = %s
                OR canceler_id = %s AND canceled_id = %s;
        """,
        (user, target, target, user)
    )
    if cur.fetchone() is not None:
        cur.close()
        return
    cur.execute(
        """
        INSERT INTO cancel (id, canceler_id, canceled_id)
        VALUES (%s, %s, %s);
        """,
        (uuid.uuid1(), user, target)
    )
    cur.execute(
        """
        DELETE FROM room
        WHERE   user_1 = %s AND user_2 = %s OR
                user_1 = %s AND user_2 = %s
        """,
        (user, target, target, user)
    )
    cur.close()
    conn.commit()
