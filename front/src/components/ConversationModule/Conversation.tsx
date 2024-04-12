import { useEffect } from "react";
import { storeSocket } from "../../tools/Stores";
import { Button, FormControl, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
const Conversation = () => {
    
    const {register, handleSubmit, reset} =  useForm()
    const socket = storeSocket(state => state.socket)

    useEffect(() => {


        return () => {

        }
    }, [])

    const onSubmit = (data : {message: string}) => {
        socket?.emit('handle_message', data)
        console.log(data.message)
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