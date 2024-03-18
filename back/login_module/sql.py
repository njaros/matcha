from db_init import db_conn as conn


def insert_new_user_in_database(sign_data):
    cur = conn.cursor()
    cur.execute(
                "INSERT INTO user_table (name, password, email)\
                    VALUES (%s, %s, %s);",
                (sign_data.get("username"),
                 sign_data.get("password"),
                 sign_data.get("email"),))
    conn.commit()
    cur.close()


def login_user_in_database(login_data):
    cur = conn.cursor()
    cur.execute(
        "SELECT id FROM user_table "
        "WHERE name = %s AND password = %s;",
        (login_data.get("username"),
         login_data.get("password"),)
    )
    id = cur.fetchone()
    print(id)
    if id is None:
        return None
    return id


def get_user_by_id(user_id):
    cur = conn.cursor()
    cur.execute(
        "SELECT * FROM user_table WHERE id = %s;", (user_id,)
    )
    return cur.fetchone()
