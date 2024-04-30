import React, {useEffect, useState} from "react";
import { storeSocket, storeRoom, storeMe, storeRoomList } from "../../tools/Stores";
import Axios from "../../tools/Caller";
import { Box, Button, ListItem, UnorderedList } from "@chakra-ui/react";
import Chatbox from "./Chatbox";
import { Room_info } from "../../tools/interface";

function ChannelList(){

    const roomList = storeRoomList(state => state.roomList)
    const [room, setRoom] = useState<Room_info>()
    console.log('from channel list', roomList)
    console.log(roomList)
    
    if (!roomList)
        return <div>No conversation yet...</div>
    return (
        <>
            <h2>Messages</h2>
            <UnorderedList>
                {roomList.map((conv, index) => (
                        <ListItem key={index}>
                            <Button onClick={() => {
                                setRoom(conv)
                            }} >{conv.name}</Button>
                        </ListItem>
                    )
                )}
            </UnorderedList>  
            <Chatbox room={room}/>
        </>
    )
}

export default ChannelList