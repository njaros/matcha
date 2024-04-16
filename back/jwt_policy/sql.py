from db_init import db_conn as conn
from error_status.error import NotFoundError


def get_user_by_id(user_id):
    cur = conn.cursor()
    query = """
            SELECT
                json_build_object(
                    'id', user_table.id,
                    'username', user_table.username,
                    'email', user_table.email,
                    'rank', user_table.rank,
                    'birthDate', user_table.birthDate,
                    'gender', user_table.gender,
                    'biography', user_table.biography,
                    'preference', user_table.preference
                )
            FROM user_table
            WHERE user_table.id = %s;
            """
    cur.execute(query, (user_id,))
    user = cur.fetchone()
    if user is None:
        raise NotFoundError(f"user {user_id} not found")
    cur.close()
    return user[0]
