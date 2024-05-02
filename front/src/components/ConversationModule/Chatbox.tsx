import { Box, Button, Flex, FormControl, Input, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { MessageData, Room_info } from "../../tools/interface"
import { useForm } from "react-hook-form";
import Axios from "../../tools/Caller";
import { storeSocket } from "../../tools/Stores";

function Chatbox(props: {room: Room_info | undefined}){
    
    const socket = storeSocket(state => state.socket)
    const [messageList, setMessageList] = useState<MessageData[]>([])
    const { 
        register, 
        handleSubmit, 
        setValue, 
        formState: { errors }
    } = useForm();

    const sendMessage = async (message: string) => {
        try{
            console.log(props.room)
            const res = await Axios.post("/chat/add_message", {'content': message, 'room_id': props.room?.id})
            console.log(res.data)
            const msg : MessageData = res.data
            socket?.emit("send_message", msg)
            setMessageList((list) => [...list, msg])
        }
        catch(err){
            if (err)
                console.error(err)
        }
    }

    const rerenderMessage = async () => {
        try{
            const res = await Axios.post("/chat/get_room_with_message", {'room_id': props.room?.id})
            console.log(res.data)
            setMessageList(res.data.messages)
        }
        catch(err){
            if (err)
                console.error(err)
        }
    }

    useEffect(() => {
        socket?.on("receive_message", (data: MessageData) => {
            console.log(data)
            if (data.room?.id === props.room?.id)
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
    return (
        <>
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