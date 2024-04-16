export interface MessageData {
    id: number;
    author: {id: string, username: string};
    content: string;
    room : {id : number} | Room
    sendAt: Date;
};

export interface Room {
    id: string,
    user_1_id: string,
    user_2_id: string,
    message: MessageData[]
}