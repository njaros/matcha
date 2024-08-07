import uuid
from flask import current_app as app
from error_status.error import ForbiddenError, NotFoundError
from psycopg.rows import dict_row
from profile_module import sql as profile_sql
from uuid import UUID


def insert_room(data):
    if room_exists(data.get("user_id1"), data.get("user_id2")):
        raise (ForbiddenError("Room already exist"))
    cur = app.config["conn"].cursor(row_factory=dict_row)
    room_id = uuid.uuid1()
    query = """
            INSERT INTO room (
                id,
                user_1,
                user_2
            )
            VALUES (%s, %s, %s)
            RETURNING id, user_1, user_2;
            """
    cur.execute(query, (room_id, data.get("user_id1"), data.get("user_id2")))
    room = cur.fetchone()
    query2 = """
            INSERT INTO unread_msg (
                user_id,
                room_id
            )
            VALUES (%s, %s)
            """
    data = [(room["user_1"], room["id"]), (room["user_2"], room["id"])]
    cur.executemany(query2, data)
    app.config["conn"].commit()
    cur.close()
    return room


def room_exists(user1_id, user2_id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT id
            FROM room
            WHERE (user_1 = %s AND user_2 = %s) OR (user_1 = %s AND user_2 = %s);
            """
    cur.execute(query, (user1_id, user2_id, user2_id, user1_id))
    result = cur.fetchone()
    cur.close()
    return result is not None


def get_room_list_by_id(user_id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT
                room.id AS id,
                CASE
                    WHEN room.user_1 = %s THEN user2.username
                    ELSE user1.username
                END AS name,
                json_build_object(
                    'user_id', room.user_1, 
                    'username', user1.username
                ) AS user_1,
                json_build_object(
                    'user_id', room.user_2, 
                    'username', user2.username
                ) AS user_2,
                (
                    SELECT json_build_object(
                        'content', message.content,
                        'author', json_build_object(
                            'id', user_table.id,
                            'username', user_table.username
                        )
                    )
                    FROM message
                    JOIN user_table ON message.sender_id = user_table.id
                    WHERE message.room_id = room.id
                    ORDER BY message.id DESC
                    LIMIT 1
                ) AS last_message_author
            FROM room
            JOIN user_table AS user1 ON room.user_1 = user1.id
            JOIN user_table AS user2 ON room.user_2 = user2.id
            WHERE room.user_1 = %s OR room.user_2 = %s
            GROUP BY room.id, user1.username, user2.username
            """
    cur.execute(query, (user_id, user_id, user_id))
    res = cur.fetchall()
    if not res:
        raise NotFoundError("This user does not have any conversation.")
    for row in res:
        row["user_1"]["photo"] = profile_sql.get_main_photo_by_user_id(
            row["user_1"]["user_id"]
        )
        row["user_2"]["photo"] = profile_sql.get_main_photo_by_user_id(
            row["user_2"]["user_id"]
        )

    cur.close()
    return res


def insert_message(data):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            INSERT INTO message (
                content,
                sender_id,
                room_id
            )
            VALUES (%s, %s, %s)
            RETURNING id;
            """
    cur.execute(
        query,
        (
            data.get("content"),
            data.get("sender_id"),
            data.get("room_id"),
        ),
    )
    id = cur.fetchone()
    app.config["conn"].commit()
    query_sender = """
                    SELECT
                        %s AS id,
                        json_build_object(
                            'id', user_table.id,
                            'username', user_table.username
                        ) AS author,
                        %s AS room_id,
                        %s AS content,
                        (SELECT send_at FROM message WHERE id = %s) AS send_at
                    FROM user_table
                    WHERE user_table.id = %s  
                    """
    cur.execute(
        query_sender,
        (
            id["id"],
            data.get("room_id"),
            data.get("content"),
            id["id"],
            data.get("sender_id"),
        ),
    )
    res = cur.fetchone()
    cur.close()
    return res


def get_message_list_by_room_id(room_id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT
                message.id,
                (SELECT json_build_object(
                    'id', user_table.id,
                    'username', user_table.username
                )
                FROM user_table
                WHERE user_table.id = message.sender_id
                ) AS author,
                message.content,
                message.room_id AS room,
                message.send_at
            FROM message
            WHERE message.room_id = %s
            ORDER BY message.id ASC;
    """

    cur.execute(query, (room_id,))
    res = cur.fetchall()
    cur.close()
    return res


def get_room(room_id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT 
                id,
                user_1 AS user_1_id,
                user_2 AS user_2_id
            FROM room
            WHERE id = %s
            """
    cur.execute(query, (room_id,))
    room = cur.fetchone()
    if room is None:
        raise NotFoundError("Room does not exist in database")
    cur.close()
    return room


def get_room_with_message(room_id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT
                room.id AS room_id,
                (
                    SELECT json_build_object(
                        'id', user_table.id,
                        'username', user_table.username,
                        'email', user_table.email,
                        'rank', user_table.rank,
                        'birthdate', user_table.birthdate,
                        'gender', user_table.gender,
                        'biography', user_table.biography,
                        'preference', user_table.preference
                    )
                    FROM user_table
                    WHERE user_table.id = room.user_1
                ) AS user_1,
                (
                    SELECT json_build_object(
                        'id', user_table.id,
                        'username', user_table.username,
                        'email', user_table.email,
                        'rank', user_table.rank,
                        'birthdate', user_table.birthdate,
                        'gender', user_table.gender,
                        'biography', user_table.biography,
                        'preference', user_table.preference
                    )
                    FROM user_table
                    WHERE user_table.id = room.user_2
                ) AS user_2,
                (
                    SELECT json_agg(
                        json_build_object(
                            'message_id', message.id,
                            'message_content', message.content,
                            'message_sender_id', message.sender_id,
                            'message_send_at', message.send_at,
                            'message_author', (
                                SELECT user_table.username 
                                FROM user_table 
                                WHERE message.sender_id = user_table.id
                            )
                        )
                    )
                    FROM message
                    WHERE message.room_id = %s 
                ) AS messages
            FROM 
                room
            WHERE 
                room.id = %s
            """

    cur.execute(query, (room_id, room_id))
    room = cur.fetchone()
    if room is None:
        raise NotFoundError("Room does not exist in database")
    cur.close()
    return room


def delete_room_by_user_ids(**kwargs):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
        DELETE FROM room
        WHERE   user_1 = %(self_id)s AND user_2 = %(other_id)s
                OR user_1 = %(other_id)s AND user_2 = %(self_id)s
        """,
        {"self_id": kwargs["user"]["id"], "other_id": kwargs["user_id"]},
    )
    app.config["conn"].commit()
    cur.close()


def increment_unread_msg_count(user_id, room_id):
    cur = app.config["conn"].cursor()
    query = """
            UPDATE unread_msg
            SET count = count + 1
            WHERE user_id = %s AND room_id = %s
            """
    cur.execute(query, (user_id, room_id))
    app.config["conn"].commit()
    cur.close()


def set_unread_msg_count_to_0(user_id, room_id):
    cur = app.config["conn"].cursor()
    query = """
            UPDATE unread_msg
            SET count = 0
            WHERE user_id = %s AND room_id = %s
            """
    cur.execute(query, (user_id, room_id))
    app.config["conn"].commit()
    cur.close()


def get_unread_msg_count(user_id, room_id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT
                count
            FROM unread_msg
            WHERE user_id = %s AND room_id = %s
            """
    cur.execute(query, (user_id, room_id))
    res = cur.fetchone()
    cur.close()
    return res


def correct_room(room_id: str | UUID, user_id: str | UUID):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT  CASE WHEN user_1 = %(user_id)s THEN user_2
                    ELSE user_1
                    END AS target
            FROM room
            WHERE id = %(room_id)s
            AND user_1 = %(user_id)s OR user_2 = %(user_id)s
            """
    cur.execute(query, {"room_id": room_id, "user_id": user_id})
    res = cur.fetchone()
    cur.close()
    if res is None:
        return None
    return res["target"]
