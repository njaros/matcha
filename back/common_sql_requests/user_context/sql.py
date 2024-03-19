from db_init import db_conn as conn


# returns None if not found
def get_user_by_id(user_id):
    cur = conn.cursor()
    cur.execute(
        "SELECT * FROM user_table WHERE id = %s;", (user_id,)
    )
    user = cur.fetchone()
    cur.close()
    return user


# returns None if not found
def get_user_by_username(username):
    cur = conn.cursor()
    cur.execute(
        "SELECT * FROM user_table WHERE username = %s;", (username,)
    )
    user = cur.fetchone()
    cur.close()
    return user
