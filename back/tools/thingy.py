def notNoneLen(data: dict):
    count = 0
    for k, v in data.items():
        if v is not None:
            count += 1
    return count
