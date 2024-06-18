import { ArrowRightIcon } from "@chakra-ui/icons";
import { Avatar, Button, Flex, FormControl, Icon, Input, Text, WrapItem } from "@chakra-ui/react";
import { decode } from 'html-entities';
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Axios from "../../tools/Caller";
import { storeMe, storeMessageList, storeMsgCount, storeRoomInfo, storeSocket } from "../../tools/Stores";
import { MessageData } from "../../tools/interface";


export function timeOfDay(timestampz: string | Date){
    const dateObj = new Date(timestampz)
    let hour = dateObj.getHours()
    let min =  dateObj.getMinutes()
    let day = dateObj.getDay()
    let month = dateObj.getMonth()
    let year = dateObj.getFullYear()
    let tmp = ""
    let tmp2 = ""
    if (min < 10)
        tmp = "0" + min.toString()
    else
        tmp = min.toString()
    if (day < 10)
        tmp2 = "0" + day.toString()
    else
        tmp2 = day.toString()
    let date = hour.toString() + ":" + tmp
    return (date)
}

function Chatbox(){
    
    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const socket = storeSocket(state => state.socket)
    const me = storeMe(state => state.me)
    const msgList = storeMessageList(state => state.messageList)
    const room = storeRoomInfo(state => state.roomInfo)
    const updateMsgCount = storeMsgCount(state => state.updateMsgCount)
    const navigate = useNavigate()
    const [messageList, setMessageList] = useState<MessageData[]>([])
    const { 
        register, 
        handleSubmit, 
        setValue, 
        formState: { errors }
    } = useForm();
    
    useEffect(() => {
        setMessageList(msgList)
    },[msgList])

    const sendMessage = async (message: string) => {
        try{
            const res = await Axios.post("/chat/add_message", {'content': message, 'room_id': room?.id})
            const senderData : MessageData = res.data
            socket?.emit("send_message", senderData)
            setMessageList((list) => [...list, senderData])
            console.log('from send message')
        }
        catch(err){
            if (err)
                console.error(err)
        }
    }

    useEffect(() => {
        socket?.on("receive_message", (data: any) => {
            console.log('from receive_message')
            if (data.room === room?.id)
            {
                setMessageList((list) => [...list, data])
            }
        })
        return (() => {
            socket?.off("receive_message")
        })
    }, [room])

    const onSubmit = async (data: {message: string}) => {
        if (data.message.length > 0 &&  /^\s*$/.test(data.message) === false)
            sendMessage(data.message)
        setValue('message', '')
    }

    useEffect(() => {

        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollTop = scrollToBottomRef.current.scrollHeight;
          }
    }, [messageList])

    const backToChannel = async () => {
        navigate(-1)
        try {
            await Axios.post('/chat/set_unread_msg_count_to_0', {'room_id': room?.id})
            
            updateMsgCount(room?.id, 0)
        }
        catch(err){
            if (err)
                console.error(err)
        }
    }
    return (
        <Flex
            h={'100%'}
            width={'100%'}
            bg={'white'}
            flexDir={'column'}
            >
            <Flex
                h={'100%'}
                flexDir={'column'}
                width={'100%'}
                bg='#f2f2f2'
            >    
                <Flex
                    width={'100%'}
                    padding={'10px'}
                    alignItems={'center'}
                    borderBottomWidth={'1px'}
                    borderBottomColor={'gray.200'}
                    bg={'white'}
                >
                    <Button 
                        onClick={backToChannel}
                        borderRadius={'100%'}
                        padding={'0'}
                        size={'sm'}
                    >
                        <Icon as={IoChevronBack} />
                    </Button>
                    <Avatar marginLeft={'15px'} src={me?.id === room?.user_1.user_id ? room?.user_2.photo : room?.user_1.photo} />
                    <Text marginLeft={'10px'} flex={1}>{room?.name}</Text>
                    <Button onClick={() => navigate('/chatbox/call/' + room?.id)}>voice call</Button>
                </Flex>
                <Flex
                    width={'100%'}
                    h={'100%'}
                    flexDir={'column'}
                    overflowY={'auto'}
                    overflowX={'hidden'}
                    ref={scrollToBottomRef}
                >
                    {messageList.map((messageContent, index) => (
                        <Flex
                            key={index}
                            w={'100%'}
                            textColor={'black'}
                            padding={'10px'}
                            paddingBottom={'0px'}
                            wrap={'wrap'}
                            justifyContent={messageContent.author.id === me?.id ? "right" : "left"}
                        >
                            <Flex
                                maxWidth={'70%'}
                                bg={messageContent.author.id === me?.id ? '#A659EC' : 'white'}
                                flexDir={'column'}
                                wrap={'wrap'}
                                borderRadius={'20px'}
                                wordBreak={'break-all'}
                                justifyContent={'center'}
                            >
                                <Flex
                                    flexDir={'row'}
                                    marginBottom={'4px'}
                                    justifyContent={'space-evenly'}
                                    alignItems={'center'}
                                >
                                    <Text padding={'7px 16px'} textColor={messageContent.author.id === me?.id ? 'white' : 'black'}>
                                        {decode(messageContent.content)}
                                    </Text>
                                </Flex>
                            </Flex>
                            <WrapItem
                                padding={'5px'}
                                fontSize={'0.6em'}
                                flexDir={'row'}
                                justifyContent={messageContent?.author.id === me?.id ? "right" : "left"}
                                width={'100%'}
                            >
                                <Text marginRight={'5px'}>{messageContent?.author.id !== me?.id ? messageContent.author?.username : ""}</Text>
                                <Text>{timeOfDay(messageContent?.send_at)}</Text>
                            </WrapItem>
                        </Flex>
                    ))}
                </Flex>
                <Flex
                    w={'100%'}
                    h={'5%'}
                    minH={'80px'}
                    flexDir={'row'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    bg='white'
                >
                    <form onSubmit={handleSubmit(onSubmit)} style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}>
                        <FormControl isRequired w={'80%'} h={'45px'}>
                            <Input
                                required={false}
                                h={'45px'}
                                border={'none'}
                                focusBorderColor="none"
                                borderRadius={'70px'}
                                bg={'#f2f2f2'}
                                type='text'
                                color='black'
                                textDecoration={'none'}
                                placeholder="Type your message..."
                                autoComplete="off"
                                {...register("message")}
                            />
                        </FormControl>
                        <Button
                            type='submit'
                            borderRadius={'0px'}
                            bg={'none'}
                            _hover={{ background: 'none', transform: 'scale(1.4)' }}
                        >
                            <ArrowRightIcon boxSize={4} color={'black'} />
                        </Button>
                    </form>
                </Flex>
            </Flex>
        </Flex>
    );
}
    

export default Chatbox

