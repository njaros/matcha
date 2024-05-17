import { Avatar, Box, Button, Flex, FormControl, Input, ListItem, OrderedList, Text, WrapItem } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { MessageData, Room_info } from "../../tools/interface"
import { useForm } from "react-hook-form";
import Axios from "../../tools/Caller";
import { storeMe, storeMessageList, storeSocket } from "../../tools/Stores";
import { decode } from 'html-entities';
import { ArrowRightIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

function timeOfDay(timestampz: string | Date){
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
    let date = hour.toString() + ":" + tmp + " " + tmp2 + "/" + month + "/" + year
    return (date)
}

function Chatbox(props: {room: Room_info | undefined}){
    
    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const socket = storeSocket(state => state.socket)
    const me = storeMe(state => state.me)
    const msgList = storeMessageList(state => state.messageList)
    // const [rerender, setRerender] = useState<boolean>(false)
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
        }
        catch(err){
            if (err)
                console.error(err)
        }
    }

    useEffect(() => {
        socket?.on("receive_message", (data: any) => {
            console.log('petit zizi le kiks')
            console.log('data room id', data.room)
            console.log('props room id', props.room?.id)
            if (data.room === props.room?.id)
            {
                // setRerender(!rerender)
                console.log('data', data)
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
    return (
        <Flex
          h={'70%'}
          width={'70%'}
          bg={'pink.200'}
          flexDir={'column'}
        >
            <Flex
            width={'100%'}
            padding={'10px'}
            alignItems={'center'}
            borderBottomWidth={'1px'}
            borderBottomColor={'pink.300'}
             >
                <Avatar src={me?.id === props.room?.user_1.user_id ? props.room?.user_2.photo : props.room?.user_1.photo}
                />
                <Text marginLeft={'10px'}>{props.room?.name}</Text>         
            </Flex>
                <Flex h={'100%'}
                flexDir={'column'}
                width={'100%'}
                bg='pink.300'
                >
                    <Flex
                    width={'100%'}
                    h={'100%'}
                    flexDir={'column'}
                    overflowY={'auto'}
                    overflowX={'hidden'}
                    ref={scrollToBottomRef}
                    >

                        {messageList.map((messageContent, index) => {
                            return (
                                <Flex
                                key={index}
                                w={'100%'}
                                bg='pink.300'
                                textColor={'white'}
                                padding={'10px'}
                                wrap={'wrap'}
                                
                                justifyContent={messageContent.author.id === me?.id ? "right" : "left"}>
                                    <Flex
                                        maxWidth={'70%'}
                                        bg={'pink.200'}
                                        flexDir={'column'}
                                        wrap={'wrap'}
                                        padding={'10px'}
                                        borderRadius={'100px'}
                                        wordBreak={'break-all'}
                                    >
                                        <Flex
                                        flexDir={'row'}
                                        marginBottom={'4px'}
                                        justifyContent={'space-evenly'}
                                        alignItems={'center'}
                                        >
                                            <Text padding={'10px'} >{decode(messageContent.content)}</Text>
                                        </Flex>
                                    </Flex>
                                    <WrapItem
                                    padding={'5px'}
                                    fontSize={'0.7em'}
                                    flexDir={'row'}
                                    justifyContent={messageContent?.author.id === me?.id ? "right" : "left"}
                                    width={'100%'}                            
                                    >
                                        <Text marginRight={'5px'}>{messageContent.author?.username}</Text>
                                        <Text>{timeOfDay(messageContent?.send_at)} </Text>
                                    </WrapItem>
                                </Flex>
                            )
                        })}
                    </Flex>
                    <Flex 
                    w={'100%'}
                    h={'5%'}
                    minH={'80px'}
                    flexDir={'row'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    bg='pink.200'
                    >
                        <form onSubmit={handleSubmit(onSubmit)} style={
                            {
                                width : '100%',
                                height : '100%',
                                display: 'flex',
                                flexDirection : 'row',
                                justifyContent : 'space-evenly',
                                alignItems : 'center'
                            }
                        }>
                            <FormControl isRequired
                            w={'80%'}
                            h={'60px'}>
                                <Input
                                    h={'60px'}
                                    border={'none'}
                                    focusBorderColor="none"
                                    borderRadius={'0px'}
                                    type='text'
                                    color='white'
                                    textDecoration={'none'}
                                    placeholder="type your message..."
                                    autoComplete="off"
                                    {...register("message", {
                                        required: "enter message",
                                    })}
                                />
                            </FormControl>

                            <Button 
                            type='submit'
                            borderRadius={'0px'}
                            bg={'none'}
                            _hover={{background : 'none', transform: 'scale(1.4)'}}
                            >
                                <ArrowRightIcon boxSize={4} color={'white'}/>
                            </Button>
                        </form>
                    </Flex>
                </Flex>
        </Flex>
    
)}

export default Chatbox