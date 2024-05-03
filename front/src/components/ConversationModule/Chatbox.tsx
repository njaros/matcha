import { Box, Button, Flex, FormControl, Input, ListItem, OrderedList, Text, WrapItem } from "@chakra-ui/react"
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
    const test = storeMessageList(state => state.messageList)
    const [messageList, setMessageList] = useState<MessageData[] | undefined>([])
    const { 
        register, 
        handleSubmit, 
        setValue, 
        formState: { errors }
    } = useForm();
    
    useEffect(() => {
        setMessageList(test)
    },[])

    const sendMessage = async (message: string) => {
        try{
            console.log(props.room)
            const res = await Axios.post("/chat/add_message", {'content': message, 'room_id': props.room?.id})
            console.log('from sendmessage',res.data)
            const msg : MessageData = res.data
            socket?.emit("send_message", msg)
            setMessageList((list) => [...list!, msg])
        }
        catch(err){
            if (err)
                console.error(err)
        }
    }

    useEffect(() => {
        socket?.on("receive_message", (data: MessageData) => {
            console.log('from useeffect',data)
            if (data.room?.id === props.room?.id)
            {
                setMessageList((list) => [...list!, data])
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
    console.log('msg list', messageList)
    return (
        <>  
            <OrderedList>
                {messageList?.map((message, index) => (
                    <ListItem key={index}>
                        <Text>{message.content}</Text>
                    </ListItem>
                ))}
            </OrderedList>
            <Flex h={'50%'}
            flexDir={'column'}
            width={'100%'}
            color='black'>
                <Text>{props.room?.name}</Text>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <Input
                            type='text'
                            placeholder="type your message"
                            {
                                ...register("message")
                            }
                        />
                        <Button
                            fontWeight={'normal'}
                            borderRadius={'0px'}
                            textAlign={'center'}
                            bg={'none'}
                            textColor={'black'}
                            type='submit' marginTop="15px"
                            >
                                send your message
                        </Button>
                    </FormControl>
                </form>
            </Flex>
        </>
    )
}

export default Chatbox