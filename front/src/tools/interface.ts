export interface MessageData {
    id: number;
    author: {id: string, username: string};
    content: string;
    room : {id : number} | Room
    send_at: Date;
}

export interface Room {
    id: string,
    name: string,
    user_1_id: string,
    user_2_id: string,
    message: MessageData[]
}

export interface Room_info {
    id: string,
    name: string,
    user1: {
        user_id: string,
        username: string
    }
    user2: {
        user_id: string,
        username: string
    }
}

export interface Me {
    biography : string | undefined,
    birthDate : string | undefined,
    email : string | undefined,
    gender : string | undefined,
    id : string | undefined,
    preference : string | undefined,
    rank : string | undefined,
    username : string | undefined,
}

export interface RoomList {
    id: string,
    name: string,
    user1: {
        user_id: string,
        username: string
    }
    user2: {
        user_id: string,
        username: string
    }
}[]