from db_init import db_conn as conn
import uuid
from flask import current_app as app


def insert_room(data):
    cur = conn.cursor()
    room_id = uuid.uuid1()
    cur.execute("INSERT INTO room (id) VALUES (%s);", (room_id,))
    obj1 = {
        'room_id': room_id,
        'user_id': data.get('user_id1')
    }
    obj2 = {
        'room_id': room_id,
        'user_id': data.get('user_id2')
    }
    insert_user_to_room(obj1)
    insert_user_to_room(obj2)
    insert_room_to_user(obj1)
    insert_room_to_user(obj2)
    conn.commit()
    cur.close()


def insert_user_to_room(data):
    cur = conn.cursor()
    cur.execute("INSERT INTO user_to_room (\
                user_id,\
                room_id)\
                VALUES (%s, %s)\
                ON CONFLICT ON CONSTRAINT user_id DO NOTHING;", (
                    data.get('user_id'),
                    data.get('room_id'),
                ))
    conn.commit()
    cur.close()


def insert_room_to_user(data):
    cur = conn.cursor()
    cur.execute("INSERT INTO room_to_user (\
                room_id,\
                user_id)\
                VALUES (%s, %s)\
                ON CONFLICT ON CONSTRAINT room_id DO NOTHING;", (
                    data.get('room_id'),
                    data.get('user_id'),
                ))
    conn.commit()
    cur.close()


def insert_room_to_message(data):
    cur = conn.cursor()
    cur.execute("INSERT INTO room_to_message (\
                room_id,\
                message_id)\
                VALUES (%s, %s);", (
                    data.get('room_id'),
                    data.get('message_id'),
                ))
    conn.commit()
    cur.close()


def insert_message(data):
    cur = conn.cursor()
    cur.execute("INSERT INTO message (\
                content,\
                user_id,\
                time,\
                room_id)\
                VALUES (%s, %s, %s, %s) RETURNING id;",(
                 data.get("content"),
                 data.get("user_id"),
                 data.get("time"),
                 data.get("room_id")))
    value = cur.fetchone()[0]
    obj = {
        'room_id': data.get("room_id"),
        'message_id': value
    }
    insert_room_to_message(obj)
    conn.commit()
    cur.close()


