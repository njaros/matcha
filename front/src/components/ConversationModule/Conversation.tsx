import { useEffect, useState } from "react";
import { storeSocket } from "../../tools/Stores";
import { Button, FormControl, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Axios from "../../tools/Caller";
const Conversation = () => {
    
    const {register, handleSubmit, reset} =  useForm()
    const socket = storeSocket(state => state.socket)
    const [me, setMe] = useState<
    {
        id: string,
        username: string
    } | undefined>(undefined)

    useEffect(() => {

            Axios.get('/user/get_me').then(
                res => {
                    console.log(res.data)
                    setMe({id: res.data.id, username: res.data.username})
                }
            ).catch(
                err => {
                    //toast error
                }
            )
            socket?.on('receive_message', (data: any) => {
                console.log('from receive: ',data)
            })
        return () => {
            socket?.off('receive_message')
        }
    }, [])

    const onSubmit = (data : {message: string}) => {
        console.log('from onsubmit: ', data.message)
        console.log(me?.id, me?.username)
        const dt = {
            user_id: me?.id,
            username: me?.username,
            content: data.message,
            room_id: 'bc239290-f0e9-11ee-8465-e5428ae796fb',
            send_at: '111'
        }
        socket?.emit('send_message', dt)
        reset()
    }
    
    return (
    <div>
        <h1>CONVERSATION PAGE</h1>
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
    </div>
    );
}

export default Conversation;