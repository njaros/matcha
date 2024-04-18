from db_init import db_conn as conn
import uuid
from psycopg.rows import dict_row

def insert_new_user_in_database(sign_data):
    cur = conn.cursor()
    cur.execute(
                "INSERT INTO user_table (id, \
                    username, \
                    password, \
                    email, \
                    birthdate, \
                    gender, \
                    preference, \
                    biography, \
                    rank)\
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);",
                (uuid.uuid1(),
                 sign_data.get("username"),
                 sign_data.get("password"),
                 sign_data.get("email"),
                 sign_data.get("birthDate"),
                 sign_data.get("gender"),
                 sign_data.get("preference"),
                 sign_data.get("biography"),
                 0))
    conn.commit()
    cur.close()


def login_user_in_database(login_data):
    cur = conn.cursor(row_factory=dict_row)
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
    return id