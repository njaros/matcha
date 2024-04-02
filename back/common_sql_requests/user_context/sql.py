from db_init import db_conn as conn


# returns None if not found
def get_user_by_id(user_id):
    cur = conn.cursor()
    query = ("""
                SELECT id,
                        username,
                        email,
                        rank       
                FROM user_table 
                WHERE id = %s;
    """)
    cur.execute(query, (user_id,))
    user = cur.fetchone()
    columns = [desc[0] for desc in cur.description]
    user_as_dict = dict(zip(columns, user))
    cur.close()
    return user_as_dict


# returns None if not found
def get_user_by_username(username):
    cur = conn.cursor()
    query = ("""
                SELECT username,
                        email,
                        rank       
                FROM user_table 
                WHERE username = %s;
    """)
    cur.execute(query, (username,))
    user = cur.fetchone()
    columns = [desc[0] for desc in cur.description]
    user_as_dict = dict(zip(columns, user))
    cur.close()
    return user_as_dict
