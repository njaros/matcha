from db_init import db_conn as conn
import uuid
from flask import current_app as app


def insert_room(data):
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
    columns = [desc[0] for desc in cur.description]
    results_as_dict = [dict(zip(columns, row)) for row in results]
    cur.close()
    return results_as_dict