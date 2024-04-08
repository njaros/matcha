from db_init import db_conn as conn
from error_status.error import NotFoundError

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
    if user is None:
        return None
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
    if user is None:
        return None
    columns = [desc[0] for desc in cur.description]
    user_as_dict = dict(zip(columns, user))
    cur.close()
    return user_as_dict


def get_user_with_room(user_id):
    if get_user_by_id(user_id) is None:
        raise(NotFoundError('This user does not exist in database'))
    cur = conn.cursor()
    query = """
            SELECT user_table.id AS user_id, 
                user_table.username AS username, 
                user_table.email AS user_email, 
                room.id AS room_id, 
                room.user_1 AS user_1_id, 
                room.user_2 AS user_2_id
            FROM user_table 
            LEFT JOIN room ON user_table.id = room.user_1 OR user_table.id = room.user_2
            WHERE user_table.id = %s;
            """
    cur.execute(query, (user_id,))
    res = cur.fetchall()
    if res is None:
        raise(NotFoundError('This user does not exist in database'))
    columns = [desc[0] for desc in cur.description]
    user = {}
    rooms = []
    for row in res:
        row_as_dict = dict(zip(columns, row))
        room = {
            'id': row_as_dict['room_id'],
            'user_1': row_as_dict['user_1_id'],
            'user_2': row_as_dict['user_2_id'],
        }
        rooms.append(room)
    user['user_id'] = row_as_dict['user_id']
    user['username'] = row_as_dict['username']
    user['email'] = row_as_dict['user_email']
    user['room'] = rooms
    cur.close()
    return user
    