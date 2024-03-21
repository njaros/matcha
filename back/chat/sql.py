from db_init import db_conn as conn
import uuid


def insert_message_in_database(data):
    cur = conn.cursor()
    cur.execute("INSERT INTO message (\
                content,\
                user_id_sender,\
                user_id_receiver,\
                time)\
                VALUES (%s, %s, %s, %s);",(
                 data.get("content"),
                 data.get("user_id_sender"),
                 data.get("user_id_receiver"),
                 data.get("time")))
    conn.commit()
    cur.close()