from error_status.error import NotFoundError
from psycopg.rows import dict_row
from flask import current_app as app


def get_user_by_id(user_id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT
                user_table.id AS id,
                user_table.username AS username,
                user_table.email AS email,
                user_table.rank AS rank,
                user_table.birthDate AS birthDate,
                user_table.gender AS gender,
                user_table.biography AS biography,
                user_table.preference AS preference,
                user_table.latitude AS latitude,
                user_table.longitude AS longitude
            FROM user_table
            WHERE user_table.id = %s;
            """
    cur.execute(query, (user_id,))
    user = cur.fetchone()
    if user is None:
        raise NotFoundError(f"user {user_id} not found")
    cur.close()
    return user
