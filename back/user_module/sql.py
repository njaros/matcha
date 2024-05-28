from db_init import db_conn as conn
from error_status.error import NotFoundError
from flask import current_app as app
from psycopg.rows import dict_row


def get_user_by_username(username):
    cur = conn.cursor(row_factory=dict_row)
    query = """
            SELECT
                user_table.id AS id,
                user_table.username AS username,
                user_table.email AS email,
                user_table.rank AS rank,
                user_table.birthDate AS birthDate,
                user_table.gender AS gender,
                user_table.biography AS biography,
                user_table.preference  AS preference
            FROM user_table
            WHERE user_table.username = %s;
            """
    cur.execute(query, (username,))
    user = cur.fetchone()
    if user is None:
        return None
    cur.close()
    app.logger.info(user)
    return user


def get_user_by_id(id):
    cur = conn.cursor(row_factory=dict_row)
    query = """
            SELECT
                user_table.id AS id,
                user_table.username AS username,
                user_table.email AS email,
                user_table.rank AS rank,
                user_table.birthDate AS birthDate,
                user_table.gender AS gender,
                user_table.biography AS biography,
                user_table.preference AS preference
            FROM user_table
            WHERE user_table.id = %s;
            """
    cur.execute(query, (id,))
    user = cur.fetchone()
    if user is None:
        return None
    cur.close()
    return user


def get_user_profile(**kwargs):
    cur = conn.cursor(row_factory=dict_row)
    app.logger.info(kwargs)
    cur.execute(
        """
        SELECT  user_table.id,
                username,
                latitude,
                longitude,
                biography,
                to_char(birthDate, 'YYYY-MM-DD') AS birthDate,
                gender,
                rank,
                (
                    SELECT json_agg (
                        json_build_object (
                            'name', hobbie.name
                        ))
                    FROM hobbie
                    LEFT OUTER JOIN user_hobbie
                        ON hobbie.id = user_hobbie.hobbie_id
                    WHERE user_id = user_table.id
                ) AS hobbies,
                CASE (
                    SELECT COUNT(*)
                    FROM relationship
                    WHERE liker_id = %(user_id)s AND liked_id = %(self_id)s
                    LIMIT 1)
                    WHEN 1 then true
                    WHEN 0 then false
                    END love,
                CASE (
                    SELECT COUNT(*)
                    FROM relationship
                    WHERE liker_id = %(self_id)s AND liked_id = %(user_id)s
                    LIMIT 1)
                    WHEN 1 then true
                    WHEN 0 then false
                    END loved
                FROM user_table
                WHERE id = %(user_id)s
        """, {"user_id": kwargs["user_id"],
              "self_id": kwargs["user"]["id"]}
    )
    user = cur.fetchone()
    cur.close()
    return user


def get_user_with_room(user_id):
    cur = conn.cursor(row_factory=dict_row)
    query = """
            SELECT
                user_table.id AS user_id,
                user_table.username AS username,
                user_table.email AS email,
                (
                    SELECT json_agg(
                        json_build_object(
                            'room_id', room.id,
                            'user_1_id', room.user_1,
                            'user_2_id', room.user_2
                        )
                    )
                    FROM room
                    WHERE user_table.id = room.user_1
                    OR user_table.id = room.user_2
                ) AS room
            FROM user_table
            WHERE user_table.id = %s
            """
    cur.execute(query, (user_id,))
    res = cur.fetchone()
    if res is None:
        raise NotFoundError('This user does not exist in database')
    cur.close()
    return res


def get_user_with_room_and_message(user_id):

    cur = conn.cursor(row_factory=dict_row)
    query = """
            SELECT
                user_table.id AS user_id,
                user_table.username AS username,
                user_table.email AS email,
                (
                    SELECT json_agg(
                        json_build_object(
                            'room_id', room.id,
                            'user_1', room.user_1,
                            'user_2', room.user_2,
                            'messages', (
                                SELECT json_agg(
                                    json_build_object(
                                        'message_id', message.id,
                                        'message_content', message.content,
                                        'message_sender_id', message.sender_id,
                                        'message_send_at', message.send_at,
                                        'message_author', (
                                            SELECT user_table.username
                                            FROM user_table
                                            WHERE message.sender_id =
                                                user_table.id
                                        )
                                    )
                                )
                                FROM message
                                WHERE message.room_id = room.id
                            )
                        )
                    )
                    FROM room
                    WHERE room.user_1 = user_table.id
                    OR room.user_2 = user_table.id
                ) AS rooms
            FROM
                user_table
            WHERE
                user_table.id = %s;
            """
    cur.execute(query, (user_id,))
    res = cur.fetchone()
    if res is None:
        raise NotFoundError('This user does not exist in database')
    cur.close()
    return res


def visite_profile(**kwargs):
    cur = conn.cursor()
    cur.execute(
        """
            INSERT INTO visits (visitor_id, visited_id)
            VALUES (%(visitor)s, %(visited)s)
        """, {"visitor": kwargs["user"]["id"],
              "visited": kwargs["user_id"]}
    )
    cur.close()
    conn.commit()


def get_visited_me_history(**kwargs):
    """Returns list of users who visited my profile
    """
    cur = conn.cursor(row_factory=dict_row)
    cur.execute(
        """
            SELECT  user_table.id AS id,
                    user_table.username AS username,
                    visits.at AS at,
                    photos.binaries AS binaries,
                    photos.mime_type AS mime_type
            FROM visits
            LEFT OUTER JOIN user_table ON visitor_id = user_table.id
            LEFT OUTER JOIN photos ON photos.user_id = user_table.id
                AND main = true
            WHERE visits.visited_id = %s
            ORDER by at DESC
        """, (kwargs["user"]["id"],)
    )
    history = cur.fetchall()
    cur.close()
    return history


def get_my_visits_history(**kwargs):
    """Returns list of users whose profile I visited
    """
    cur = conn.cursor(row_factory=dict_row)
    cur.execute(
        """
            SELECT  user_table.id AS id,
                    user_table.username AS username,
                    visits.at AS at,
                    photos.binaries AS binaries,
                    photos.mime_type AS mime_type
            FROM visits
            LEFT OUTER JOIN user_table ON visited_id = user_table.id
            LEFT OUTER JOIN photos ON photos.user_id = user_table.id
                AND photos.main = true
            WHERE visits.visitor_id = %s
            ORDER by at DESC
        """, (kwargs["user"]["id"],)
    )
    history = cur.fetchall()
    cur.close()
    return history
