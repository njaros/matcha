import { Box, Flex, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { MessageData, Room_info } from "../../tools/interface"
import { useForm } from "react-hook-form";
import Axios from "../../tools/Caller";

function Chatbox(props: {room: Room_info | undefined}){
    
    const [messageList, setMessageList] = useState<MessageData[]>([])
    const { 
        register, 
        handleSubmit, 
        setValue, 
        formState: { errors }
    } = useForm();

    const sendMessage = async (message: string) => {
        try{
            const res = await Axios.post("/chat/add_message", {'content': message, 'room_id': props.room?.id})
        }
        catch(err){
            if (err)
                console.error(err)
        }
    }
 
    return (
        <>
            <Flex h={'50%'}
            flexDir={'column'}
            width={'100%'}
            color='black'>
                <Text>{props.room?.name}</Text>
            </Flex>
        </>
    )
}

export default Chatbox