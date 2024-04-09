from db_init import db_conn as conn
from error_status.error import NotFoundError
from flask import current_app as app

def get_user_by_id(user_id):
    cur = conn.cursor()
    query = """
            SELECT
                json_build_object(
                    'id', user_table.id,
                    'username', user_table.username,
                    'email', user_table.email,
                    'rank', user_table.rank,
                    'age', user_table.age,
                    'gender', user_table.gender,
                    'biography', user_table.biography,
                    'pref', user_table.pref
                )
            FROM user_table
            WHERE user_table.id = %s;
            """
    cur.execute(query, (user_id,))
    user = cur.fetchone()[0]
    if user is None:
        return None
    cur.close()
    return user


def get_user_by_username(username):
    cur = conn.cursor()
    query = """
            SELECT
                json_build_object(
                    'id', user_table.id,
                    'username', user_table.username,
                    'email', user_table.email,
                    'rank', user_table.rank,
                    'age', user_table.age,
                    'gender', user_table.gender,
                    'biography', user_table.biography,
                    'pref', user_table.pref
                )
            FROM user_table
            WHERE user_table.username = %s;
            """
    cur.execute(query, (username,))
    user = cur.fetchone()[0]
    if user is None:
        return None
    cur.close()
    return user


def get_user_with_room(user_id):
    if get_user_by_id(user_id) is None:
        raise NotFoundError('This user does not exist in database')
    cur = conn.cursor()
    query = """
            SELECT 
                json_build_object(
                    'user_id', user_table.id,
                    'username', user_table.username,
                    'email', user_table.email,
                    'rooms', (
                        SELECT json_agg(
                            json_build_object(
                                'room_id', room.id,
                                'user_1_id', room.user_1,
                                'user_2,id', room.user_2
                            )
                        )
                        FROM room
                        WHERE user_table.id = room.user_1 OR user_table.id = room.user_2
                    )
                )
            FROM user_table
            WHERE user_table.id = %s
            """
    cur.execute(query, (user_id,))
    res = cur.fetchone()[0]
    if res is None:
        raise NotFoundError('This user does not exist in database')
    cur.close()
    return res
    

def get_user_with_room_and_message(user_id):
    if get_user_by_id(user_id) is None:
        raise NotFoundError('This user does not exist in database')
    cur = conn.cursor()
    query = """
            SELECT
                json_build_object(
                    'user_id', user_table.id,
                    'username', user_table.username,
                    'email', user_table.email,
                    'rooms', (
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
                                                WHERE message.sender_id = user_table.id
                                            )
                                        )
                                    )
                                    FROM message
                                    WHERE message.room_id = room.id
                                )
                            )
                        )
                        FROM room
                        WHERE room.user_1 = user_table.id OR room.user_2 = user_table.id
                    )
                ) 
            FROM
                user_table
            WHERE
                user_table.id = %s;
            """
    cur.execute(query, (user_id,))
    res = cur.fetchone()[0]
    if res is None:
        raise NotFoundError('This user does not exist in database')
    cur.close()
    return res