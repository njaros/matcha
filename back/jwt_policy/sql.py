from db_init import db_conn as conn
from error_status.error import NotFoundError
from psycopg.rows import dict_row

def get_user_by_id(user_id):
    cur = conn.cursor(row_factory=dict_row)
    query = """
            SELECT
                user_table.id AS id,
                user_table.username AS username,
                user_table.email AS email,
                user_table.rank AS rank,
                user_table.birthDate AS birthDate,
                user_table.gender AS gender,
                user_table.biography AS biography,
                user_table.preference AS preference
            FROM user_table
            WHERE user_table.id = %s;
            """
    cur.execute(query, (user_id,))
    user = cur.fetchone()
    if user is None:
        raise NotFoundError(f"user {user_id} not found")
    cur.close()
    return user
