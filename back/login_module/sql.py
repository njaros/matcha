from db_init import db_conn as conn
import uuid


def insert_new_user_in_database(sign_data):
    cur = conn.cursor()
    cur.execute(
                "INSERT INTO user_table (id, username, password, email)\
                    VALUES (%s, %s, %s, %s);",
                (uuid.uuid1(),
                 sign_data.get("username"),
                 sign_data.get("password"),
                 sign_data.get("email"),))
    conn.commit()
    cur.close()


def login_user_in_database(login_data):
    cur = conn.cursor()
    cur.execute(
        "SELECT id FROM user_table "
        "WHERE username = %s AND password = %s;",
        (login_data.get("username"),
         login_data.get("password"),)
    )
    id = cur.fetchone()
    if id is None:
        return None
    cur.close()
    return id[0]