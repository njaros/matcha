import { useEffect, useState, useRef } from "react";
import { storeSocket, storeRoom, storeMe, storeRoomList } from "../../tools/Stores";
import { Button, FormControl, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Axios from "../../tools/Caller";
import ChannelList from "./channel";
import Chatbox from "./Chatbox";

function Conversation(){
    
    const socket = storeSocket(state => state.socket)
    const [room, updateRoom] = storeRoom(state => [state.room, state.updateRoom]);
    const [roomList, updateRoomList] = storeRoomList(state => [state.roomList, state.updateRoomList])
    const me = storeMe(state => state.me)

    useEffect(() => {
        if (me){
            const fetchData = async () => {
                try {
                    const roomResponse = await Axios.get('/chat/get_room_list_by_id');
                    updateRoomList(roomResponse.data)
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }
    }, [me]);

    return (
    <>    
        <ChannelList />
    </>
    );
}

export default Conversation;


// function Conversation(){
    
//     const {register, handleSubmit, reset} =  useForm()
//     const socket = storeSocket(state => state.socket)
//     const [me, setMe] = useState<
//     {
//         id: string,
//         username: string
//     } | undefined>(undefined)

//     useEffect(() => {
//             Axios.get('/user/get_me').then(
//                 res => {
//                     console.log(res.data)
//                     setMe({id: res.data.id, username: res.data.username})
//                 }
//             ).catch(
//                 err => {
//                     //toast error
//                 }
//             )
//             socket?.on('receive_message', (data: any) => {
//                 console.log('from receive: ',data)
//             })
//         return () => {
//             socket?.off('receive_message')
//         }
//     }, [])

//     const onSubmit = (data : {message: string}) => {
//         console.log('from onsubmit: ', data.message)
//         console.log(me?.id, me?.username)
//         const dt = {
//             user_id: me?.id,
//             username: me?.username,
//             content: data.message,
//             room_id: 'bc239290-f0e9-11ee-8465-e5428ae796fb',
//             send_at: '111'
//         }
//         socket?.emit('send_message', dt)
//         reset()
//     }
    
//     return (
//     <div>
//         <h1>CONVERSATION PAGE</h1>
//         <form onSubmit={handleSubmit(onSubmit)}>
//         <FormControl>
//             <Input
//                 type='text'
//                 placeholder="type your message"
//                 {
//                     ...register("message")
//                 }
//             />
//             <Button
//                 fontWeight={'normal'}
//                 borderRadius={'0px'}
//                 textAlign={'center'}
//                 bg={'none'}
//                 textColor={'black'}
//                 type='submit' marginTop="15px"
//                 >
//                     send your message
//             </Button>
//         </FormControl>

//         </form>
//     </div>
//     );
// }

// export default Conversation;