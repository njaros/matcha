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
    app.logger.info(data)
    cur.execute("INSERT INTO room (\
                id,\
                user_1,\
                user_2)\
                VALUES (%s, %s, %s);",(
                    room_id,
                    data.get('user_id1'),
                    data.get('user_id2')))
    conn.commit()
    cur.close()

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
            SELECT *
            FROM room
            WHERE id = %s;
            """
    cur.execute(query, (room_id,))
    res = cur.fetchone()
    if res is None:
        raise(NotFoundError('Room does not exist in database'))
    columns = [desc[0] for desc in cur.description]
    room = dict(zip(columns, res))
    cur.close()
    return room



def get_room_with_message(room_id):
    cur = conn.cursor()
    query = """
        SELECT room.id AS room_id, 
                room.user_1 AS user_1_id, 
                room.user_2 AS user_2_id,
                message.id AS message_id, 
                message.content AS message_content, 
                message.sender_id AS message_sender_id, 
                message.send_at AS message_send_at
        FROM room
        LEFT JOIN message ON room.id = message.room_id
        WHERE room.id = %s;
        """
    cur.execute(query, (room_id,))
    results = cur.fetchall()
    if results is None:
        raise(NotFoundError('Room does not exist in database'))
    columns = [desc[0] for desc in cur.description]
    room = {}
    messages = []
    for row in results:
        row_as_dict = dict(zip(columns, row))
        message = {
            'message_id': row_as_dict['message_id'],
            'message_content': row_as_dict['message_content'],
            'message_sender_id': row_as_dict['message_sender_id'],
            'message_send_at': row_as_dict['message_send_at']
        }
        messages.append(message)

    room['room_id'] = row_as_dict['room_id']
    room['user_1'] = user_sql.get_user_by_id(row_as_dict['user_1_id'])
    room['user_2'] = user_sql.get_user_by_id(row_as_dict['user_2_id'])
    room['messages'] = messages
    cur.close()
    return room