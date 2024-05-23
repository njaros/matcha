import React, {useEffect, useRef, useState} from "react";
import { storeSocket, storeRoom, storeMe, storeRoomList, storeMessageList, storeConvBool } from "../../tools/Stores";
import Axios from "../../tools/Caller";
import { Box, Button, ListItem, UnorderedList, Flex, Text, Avatar, Icon, Divider } from "@chakra-ui/react";
import Chatbox from "./Chatbox";
import { RoomList, Room_info } from "../../tools/interface";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { BsArrowReturnRight } from "react-icons/bs";


function Conv(props: {conv: any, index: number, me: any, join_room: any, setRoom: any, setMessageList: any}){

    const [lastMessage, setLastMessage] = useState<{sender_id: string, content: string}>(
        {
            sender_id: props.conv.last_message_author?.author.id, 
            content: props.conv.last_message_author?.content
        })
    const socket = storeSocket(state => state.socket)

    useEffect(() => {
        socket?.on('last_message', (data: any) => {
            console.log(data)
            if (data.room === props.conv.id){
                console.log(data.content)
                setLastMessage({sender_id: data.author.user_id, content: data.content})
            }   
        })
        return (() => {
            socket?.off('last_message')
        })
    }, [])

    return (
        <Flex
        key={props.index}
        w={'100%'}
        bg='#f2f2f2'
        textColor={'Black'}
        padding={'10px'}
    >
        <Avatar src={props.me?.id === props.conv.user_1.user_id ? props.conv.user_2?.photo : props.conv?.user_1?.photo}/>
            <Box
                flex={1}
                onClick={() => {
                    props.join_room(props.conv.id)
                    props.setRoom(props.conv)
                    props.setMessageList(props.conv)
                }}
                marginLeft={'10px'}
                textOverflow="ellipsis" 
                overflow="hidden" 
                whiteSpace="nowrap"
            >
                <Box>{props.conv.name}</Box>
                <Text
                    fontSize={'small'} 
                    opacity={'50%'}
                    textOverflow="ellipsis" 
                    overflow="hidden" 
                    whiteSpace="nowrap"
                >
                    {props.me?.id === lastMessage?.sender_id ? 
                    "You: " + lastMessage.content : 
                    <>
                        {props.conv.last_message_author && <Icon as={BsArrowReturnRight} marginRight={'5px'}/>}
                        {lastMessage.content}
                    </>
                    }
                </Text>
            </Box>
    </Flex>
    )
}


function ChannelList(){

    const me = storeMe(state => state.me)
    // const [convBool, updateConvBool] = storeConvBool(state => [state.convBool, state.updateConvBool])
    const roomList = storeRoomList(state => state.roomList)
    const socket = storeSocket(state => state.socket)
    const [room, setRoom] = useState<Room_info>()
    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const [msgList, setMsgList] = storeMessageList(state => [state.messageList, state.updateMessageList])
    const [showChat, setShowChat] = useState<boolean>(false)
    const [convBool, setConvBool] = useState<boolean>(false)


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

    const handler_convBool = () => {
        setConvBool(!convBool)
        console.log('convBool', convBool)
        console.log('from bool_handler')
    }

    const join_room = (id: string) => {
        // socket?.emit('join_chat_room', id)
        setShowChat(!showChat)
        // handler_convBool()
    }
    
    // useEffect(() => {
    //     socket?.on('receive_message', (data: any) => {
    //         console.log(data)
    //         setLastMessage(data.content)
    //     })
    //     return (() => {
    //         socket?.off('receive_message')
    //     })
    // }, [])

    useEffect(() => {

        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollTop = scrollToBottomRef.current.scrollHeight;
          }
    }, [roomList])

    // console.log('room id', lastMessage?.room_id, 'content', lastMessage?.content)
    return (
        <Flex 
            h={'100%'}
            w={'100%'}
            bg={'white'}
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
                        <Box
                            key={index}
                        >
                            <Conv 
                                conv={conv} 
                                index={index} 
                                me={me} 
                                join_room={join_room} 
                                setRoom={setRoom} 
                                setMessageList={setMessageList}
                            />
                        </Box>                                
                        ))}
                    </Flex>
                </Flex>
            ) : (
                room && <Chatbox room={room} bool_handler={handler_convBool}/>
            )}
        </Flex>
    );
}


export default ChannelList