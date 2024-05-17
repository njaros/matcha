import React, {useEffect, useRef, useState} from "react";
import { storeSocket, storeRoom, storeMe, storeRoomList, storeMessageList } from "../../tools/Stores";
import Axios from "../../tools/Caller";
import { Box, Button, ListItem, UnorderedList, Flex, Text, Avatar } from "@chakra-ui/react";
import Chatbox from "./Chatbox";
import { RoomList, Room_info } from "../../tools/interface";

function ChannelList(){

    const me = storeMe(state => state.me)
    const roomList = storeRoomList(state => state.roomList)
    const socket = storeSocket(state => state.socket)
    const [room, setRoom] = useState<Room_info>()
    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const [msgList, setMsgList] = storeMessageList(state => [state.messageList, state.updateMessageList])

    const setMessageList = async (conv: Room_info) => {
        try{
            const res = await Axios.post('/chat/get_message_list_by_room_id', {'room_id': conv?.id})
            setMsgList(res.data)
        }
        catch(err){
            if (err)
                console.error(err)
        }
    }

    const join_room = (id: string) => {
        socket?.emit('join_chat_room', id)
    }
    
    useEffect(() => {

        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollTop = scrollToBottomRef.current.scrollHeight;
          }
    }, [roomList])

    if (!roomList)
        return <div>No conversation yet...</div>
    return (
        <Flex 
            h={'100%'}
            w={'100%'}
            bg={'pink'}
            flexDirection="column"
        >
            <Flex
                h={'100%'}
                w={'100%'}
                flexDirection="column"
                marginTop={'5%'}
            >
                <Text 
                    fontWeight={'bold'} 
                    marginLeft={'10px'} 
                    marginBottom={'10px'}
                >
                    Conversation</Text>
                <Flex
                    width={'100%'}
                    h={'100%'}
                    flexDir={'column'}
                    overflowY={'auto'}
                    overflowX={'hidden'}
                    ref={scrollToBottomRef}
                >
                        {roomList.map((conv, index) => {
                            return (
                                <Flex
                                key={index}
                                w={'100%'}
                                bg='pink.300'
                                textColor={'Black'}
                                padding={'10px'}
                                wrap={'wrap'}
                                >
                                    <Avatar src={me?.id === conv.user_1.user_id ? conv.user_2?.photo : conv?.user_1?.photo}/>
                                    <Box onClick={() => {
                                        join_room(conv.id)
                                        setRoom(conv)
                                        setMessageList(conv)
                                    }}
                                    marginLeft={'10px'}
                                    
                                    >{conv.name}</Box>
                                </Flex>
                            )
                        })}
                </Flex>                
                    
                {room && <Chatbox room={room}/>}
            </Flex>

        </Flex>
    )
}

export default ChannelList