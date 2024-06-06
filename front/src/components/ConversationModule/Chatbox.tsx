import { Avatar, Box, Button, Flex, FormControl, Icon, Input, ListItem, OrderedList, Text, WrapItem } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { MessageData, Room_info } from "../../tools/interface"
import { useForm } from "react-hook-form";
import Axios from "../../tools/Caller";
import { storeMe, storeMessageList, storeSocket, storeConvBool, storeMsgCount } from "../../tools/Stores";
import { decode } from 'html-entities';
import { ArrowRightIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import ChannelList from "./channel";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import { IoIosCall } from "react-icons/io";
import SimplePeer from 'simple-peer'


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

function VoiceChat(props: {targetId: string}){
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const partnerVideo = useRef<HTMLVideoElement>(null);
    const socket = storeSocket(state => state.socket)


    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true})
            .then(currentStream => {
                setStream(currentStream)
                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream
                }
                
            })
            .catch(error => {
                console.error('Error accessing media devices.', error);
              });
        
        socket?.on('offer', (data: any) => {
            const peer = new SimplePeer({
                initiator: false,
                trickle: false,
                stream: stream || undefined
            })
            peer.on('signal', (signal: any) => {
                socket.emit('answer', {signal: signal, to: data.from})
            })
            peer.on('stream', (partnerStream: any) => {
                console.log('from stream')
                if (partnerVideo.current){
                    partnerVideo.current.srcObject = partnerStream
                }
            })
            peer.signal(data.signal)
            setPeer(peer)
        })
        
        socket?.on('answer', (data: any) => {
            peer?.signal(data.signal)
        })

        return () => {
            socket?.off('connect')
            socket?.off('disconnect')
            socket?.off('offer')
            socket?.off('answer')
          }

    }, [stream])

    const callUser = (userId: string) => {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream: stream || undefined
        })
        peer.on('signal', (signal: any) => {
            socket?.emit('offer', {signal: signal, to: userId})
        })
        peer.on('stream', (partnerStream: any) => {
            if (partnerVideo.current){
                partnerVideo.current.srcObject = partnerStream
            }
        })
        setPeer(peer)
    }

    const handle = () => {
        callUser(props.targetId)
    }

    return (
        <>
            <Flex flexDir={'column'} flex={1}>
                <video title="MOI" ref={userVideo} autoPlay></video>
                <video ref={partnerVideo} autoPlay></video>
            </Flex>
            <Button onClick={handle}></Button>
        </>
    )
}

function Chatbox(props: {room: Room_info | undefined}){
    
    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const socket = storeSocket(state => state.socket)
    const me = storeMe(state => state.me)
    const msgList = storeMessageList(state => state.messageList)
    const [convBool, updateConvBool] = storeConvBool(state => [state.convBool, state.updateConvBool])
    const [msgCount, updateMsgCount] = storeMsgCount(state => [state.msgCount, state.updateMsgCount])
    const [isCalling, setIsCalling] = useState(false)
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
            const res = await Axios.post("/chat/add_message", {'content': message, 'room_id': props.room?.id})
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
            if (data.room === props.room?.id)
            {
                setMessageList((list) => [...list, data])
            }
        })
        return (() => {
            socket?.off("receive_message")
        })
    }, [props.room])

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
        updateConvBool(!convBool)
        try {
            await Axios.post('/chat/set_unread_msg_count_to_0', {'room_id': props.room?.id})
            
            updateMsgCount(props.room!.id, 0)
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
            hidden={convBool === false}
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
                    <Avatar marginLeft={'15px'} src={me?.id === props.room?.user_1.user_id ? props.room?.user_2.photo : props.room?.user_1.photo} />
                    <Text marginLeft={'10px'} flex={1}>{props.room?.name}</Text>
                    <Button onClick={() => setIsCalling(true)}>voice call</Button>
                    {isCalling && <VoiceChat targetId={props.room?.id}/>}
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

