import { Avatar, Box, Flex, Icon, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { BsArrowReturnRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Axios from "../../tools/Caller";
import { storeDisplayNavBool, storeMe, storeMessageList, storeMsgCount, storeRoomInfo, storeRoomList, storeSocket } from "../../tools/Stores";
import { Room_info } from "../../tools/interface";


function Conv(props: {conv: any, index: number, me: any, join_room: any, setMessageList: any}){
    
    const navigate = useNavigate()
    const updateRoom = storeRoomInfo(state => state.updateRoomInfo)
    const msgCount = storeMsgCount(state => state.msgCount)
    const [lastMessage, setLastMessage] = useState<{sender_id: string, content: string}>(
        {
            sender_id: props.conv.last_message_author?.author.id, 
            content: props.conv.last_message_author?.content
        })
    const socket = storeSocket(state => state.socket)

    //a fix
    useEffect(() => {
        socket?.on('last_message', (data: any) => {
            if (data.room === props.conv.id){
                console.log('alaid')
                setLastMessage({sender_id: data.author.user_id, content: data.content})
            }   
        })
        return (() => {
            socket?.off('last_message')
        })
    }, [])
    const current_count = msgCount[props.conv.id]?.count 
    return (
        <Flex
            alignItems={'center'}
            key={props.index}
            w={'100%'}
            bg='#f2f2f2'
            textColor={'Black'}
            padding={'10px'}
            onClick={() => {
                console.log('from chann', props.conv)
                props.join_room(props.conv.id)
                updateRoom(props.conv)
                props.setMessageList(props.conv)
                navigate('/chatbox')
            }}
        >
            <Avatar src={props.me?.id === props.conv.user_1.user_id ? props.conv.user_2?.photo : props.conv?.user_1?.photo}/>
                <Box
                    flex={1}
        
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
                <Box margin={15} position="relative">
                <Box
                    width={6} 
                    height={6}
                    borderRadius="full" 
                    backgroundColor={current_count > 0 ? "#A659EC" : ""} 
                    display="flex"
                    justifyContent="center"
                    alignItems={'center'}
                >
                    <Text fontSize={'small'} textColor={'#f2f2f2'}>{current_count > 0 ? current_count : ""}</Text>
                </Box>
            </Box>
    </Flex>
    )
}


function ChannelList(){

    const me = storeMe(state => state.me)
    const [roomList, updateRoomList] = storeRoomList(state => [state.roomList, state.updateRoomList])
    const socket = storeSocket(state => state.socket)
    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const setMsgList = storeMessageList(state => state.updateMessageList)

    useEffect(() => {
        if (me){
            const fetchData = async () => {
                try {
                    const roomResponse = await Axios.get('/chat/get_room_list_by_id');
                    const updatedRoomList = roomResponse.data.map((room: any) => {
                        return {
                            ...room,
                            user_1: {
                                ...room.user_1,
                                photo: "data:".concat(room.user_1.photo?.mime_type).concat(";base64,").concat(room.user_1.photo?.binaries),
                            },
                            user_2: {
                                ...room.user_2,
                                photo: "data:".concat(room.user_2.photo?.mime_type).concat(";base64,").concat(room.user_2.photo?.binaries),
                            }
                        }
                    })
                    updateRoomList(updatedRoomList)
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }
    }, [me]);

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

    const join_room = async (room_id: string) => {
        socket?.emit('join_chat_room', room_id)
    }

    useEffect(() => {

        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollTop = scrollToBottomRef.current.scrollHeight;
          }
    }, [roomList])

    return (
        <Flex 
            h={'100%'}
            w={'100%'}
            bg={'white'}
            flexDirection="column"
        >
            <Flex
                h={'100%'}
                w={'100%'}
                flexDirection="column"
                marginTop={'5%'}
            >
                <Text 
                    fontSize={'x-large'}
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
                            setMessageList={setMessageList}
                        />
                    </Box>                                
                    ))}
                </Flex>
            </Flex>

        </Flex>
    );
}

export default ChannelList