import React, {useEffect, useState} from "react";
import { storeSocket, storeRoom, storeMe, storeRoomList, storeMessageList } from "../../tools/Stores";
import Axios from "../../tools/Caller";
import { Box, Button, ListItem, UnorderedList, Flex } from "@chakra-ui/react";
import Chatbox from "./Chatbox";
import { RoomList, Room_info } from "../../tools/interface";

function ChannelList(){

    const roomList = storeRoomList(state => state.roomList)
    const [room, setRoom] = useState<Room_info>()
    const [msgList, setMsgList] = storeMessageList(state => [state.messageList, state.updateMessageList])

    const setMessageList = async (conv: Room_info) => {
        try{
            console.log('room_id', conv.id)
            const res = await Axios.post('/chat/get_message_list_by_room_id', {'room_id': conv?.id})
            console.log('from setMessageList ',res.data)
            setMsgList(res.data)
        }
        catch(err){
            if (err)
                console.error(err)
        }
    }
    
    if (!roomList)
        return <div>No conversation yet...</div>
    return (
        <Flex 
        h={'100%'}

        >
            <UnorderedList>
                {roomList.map((conv, index) => (
                        <ListItem key={index}>
                            <Button onClick={() => {
                                setRoom(conv)
                                setMessageList(conv)
                            }} >{conv.name}</Button>
                        </ListItem>
                    )
                )}
            </UnorderedList>  
            {room && <Chatbox room={room}/>}

        </Flex>
    )
}

export default ChannelList