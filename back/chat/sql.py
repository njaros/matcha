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
    value = cur.fetchone()[0]
    conn.commit()
    cur.close()


