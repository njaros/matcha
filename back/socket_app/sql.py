from flask import current_app as app


def reset_last_connection(user_id):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
        UPDATE user_table
        SET last_connection = NOW()
        WHERE id = %s
        """,
        (user_id,)
    )
    app.config["conn"].commit()
    cur.close()
