import React, {useEffect, useRef, useState} from "react";
import { storeSocket, storeRoom, storeMe, storeRoomList, storeMessageList, storeConvBool } from "../../tools/Stores";
import Axios from "../../tools/Caller";
import { Box, Button, ListItem, UnorderedList, Flex, Text, Avatar, Icon } from "@chakra-ui/react";
import Chatbox from "./Chatbox";
import { RoomList, Room_info } from "../../tools/interface";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { BsArrowReturnRight } from "react-icons/bs";


function ChannelList(){

    const me = storeMe(state => state.me)
    const [convBool, updateConvBool] = storeConvBool(state => [state.convBool, state.updateConvBool])
    const roomList = storeRoomList(state => state.roomList)
    const socket = storeSocket(state => state.socket)
    const [room, setRoom] = useState<Room_info>()
    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const [msgList, setMsgList] = storeMessageList(state => [state.messageList, state.updateMessageList])
    const [showChat, setShowChat] = useState<boolean>(false)

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
        setShowChat(!showChat)
        updateConvBool(!convBool)
    }
    
    useEffect(() => {

        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollTop = scrollToBottomRef.current.scrollHeight;
          }
    }, [roomList])
    console.log('room list from channel', roomList)
    return (
        <Flex 
            h={'100%'}
            w={'100%'}
            bg={'pink'}
            flexDirection="column"
        >
            {!showChat ? (
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
                        Conversation
                    </Text>
                    <Flex
                        width={'100%'}
                        h={'100%'}
                        flexDir={'column'}
                        overflowY={'auto'}
                        overflowX={'hidden'}
                        ref={scrollToBottomRef}
                    >
                        {roomList && roomList.map((conv, index) => (
                            <Flex
                                key={index}
                                w={'100%'}
                                bg='pink.300'
                                textColor={'Black'}
                                padding={'10px'}
                                
                            >
                                <Avatar src={me?.id === conv.user_1.user_id ? conv.user_2?.photo : conv?.user_1?.photo}/>
                                    <Box
                                        flex={1}
                                        onClick={() => {
                                            join_room(conv.id)
                                            setRoom(conv)
                                            setMessageList(conv)
                                        }}
                                        marginLeft={'10px'}
                                        textOverflow="ellipsis" 
                                        overflow="hidden" 
                                        whiteSpace="nowrap"
                                    >
                                        <Box>{conv.name}</Box>
                                        <Text 
                                            fontSize={'small'} 
                                            opacity={'50%'}
                                            textOverflow="ellipsis" 
                                            overflow="hidden" 
                                            whiteSpace="nowrap"
                                        >
                                            {me?.id === conv.last_message_author?.author.id ? 
                                            "You: " + conv.last_message_author?.content : 
                                            <>
                                                {conv.last_message_author && <Icon as={BsArrowReturnRight} marginRight={'5px'}/>}
                                                {conv.last_message_author?.content}
                                            </>
                                            }
                                        </Text>
                                    </Box>
                                </Flex>
                        ))}
                    </Flex>
                </Flex>
            ) : (
                room && <Chatbox room={room}/>
            )}
        </Flex>
    );
}


export default ChannelList