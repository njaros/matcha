from db_init import db_conn as conn
import uuid
from user_module import sql as user_sql
from flask import current_app as app
from error_status.error import ForbiddenError, NotFoundError

def insert_room(data):
    if room_exists(data.get('user_id1'), data.get('user_id2')):
        raise(ForbiddenError('Room already exist'))
    cur = conn.cursor()
    room_id = uuid.uuid1()
    query = """
            INSERT INTO room (
                id,
                user_1,
                user_2
            )
            VALUES (%s, %s, %s)
            RETURNING json_build_object(
                'id', id,
                'user_1', user_1,
                'user_2', user_2
            );
            """
    cur.execute(query, (room_id, data.get('user_id1'), data.get('user_id2')))
    room = cur.fetchone()
    conn.commit()
    cur.close()
    return room[0]

def room_exists(user1_id, user2_id):
    cur = conn.cursor()
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
    cur = conn.cursor()
    query = """
            SELECT
                json_build_object(
                    'id', room.id,
                    'user_1', (
                        SELECT json_agg(
                            json_build_object(
                                'user_id', room.user_1, 
                                'username', user1.username
                            )
                        )
                    ),
                    'user_2', (
                        SELECT json_agg(
                            json_build_object(
                                'user_id', room.user_2, 
                                'username', user2.username
                            )
                        )
                    )
                )
            FROM room
            JOIN user_table AS user1 ON room.user_1 = user1.id
            JOIN user_table AS user2 ON room.user_2 = user2.id
            WHERE room.user_1 = %s OR room.user_2 = %s
            GROUP BY room.id
            """

    cur.execute(query, (user_id, user_id))
    res = cur.fetchall()
    if not res:
        raise NotFoundError('This user does not have any conversation.')
    cur.close()
    app.logger.info(res)
    return res



def insert_message(data):
    cur = conn.cursor()
    cur.execute("INSERT INTO message (\
                content,\
                sender_id,\
                room_id)\
                VALUES (%s, %s, %s) RETURNING id;",(
                 data.get("content"),
                 data.get("sender_id"),
                 data.get("room_id")))
    conn.commit()
    cur.close()


def get_room(room_id):
    cur = conn.cursor()
    query = """
            SELECT 
                json_build_object(
                    'id', room.id,
                    'user_1_id', room.user_1,
                    'user_2_id', room.user_2
                )
            FROM room
            WHERE room.id = %s
            """
    cur.execute(query, (room_id,))
    room = cur.fetchone()
    if room is None:
        raise NotFoundError('Room does not exist in database')
    cur.close()
    return room[0]



def get_room_with_message(room_id):
    cur = conn.cursor()
    query = """
            SELECT
                json_build_object(
                    'room_id', room.id,
                    'user_1', (SELECT json_agg(
                                json_build_object(
                                    'id', user_table.id,
                                    'username', user_table.username,
                                    'email', user_table.email,
                                    'rank', user_table.rank,
                                    'birthdate', user_table.birthdate,
                                    'gender', user_table.gender,
                                    'biography', user_table.biography,
                                    'preference', user_table.preference
                                )
                            )
                            FROM user_table
                            WHERE user_table.id = room.user_1 ),

                    'user_2', (SELECT json_agg(
                        json_build_object(
                            'id', user_table.id,
                            'username', user_table.username,
                            'email', user_table.email,
                            'rank', user_table.rank,
                            'birthdate', user_table.birthdate,
                            'gender', user_table.gender,
                            'biography', user_table.biography,
                            'preference', user_table.preference
                        )
                    )
                    FROM user_table
                    WHERE user_table.id = room.user_2 ),
                    
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
                        WHERE message.room_id = %s 
                    )
                )
            FROM 
                room
            WHERE 
                room.id = %s
            """
    cur.execute(query, (room_id, room_id))
    room = cur.fetchone()
    if room is None:
        raise NotFoundError('Room does not exist in database')
    cur.close()
    return room[0]