def insert_new_user_in_database(conn, user_data):
    print(user_data["password"])
    cur = conn.cursor()
    cur.execute(
                "INSERT INTO user_table (name, password, email)\
                    VALUES (%s, %s, %s);",
                (user_data.get("user_name"),
                 user_data.get("password"),
                 user_data.get("email"),))
    conn.commit()
    cur.close()
