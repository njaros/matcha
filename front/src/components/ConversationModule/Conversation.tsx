import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import Axios from "../../tools/Caller";
import { storeConvBool, storeMe, storeRoomList } from "../../tools/Stores";
import ChannelList from "./channel";

function Conversation(){
    
    const updateRoomList = storeRoomList(state => state.updateRoomList)
    const convBool = storeConvBool(state => state.convBool)
    const me = storeMe(state => state.me)
    
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
    }, [me, convBool]);

    return (
    <Box flexGrow={1} w={'100%'} h={'100%'}>    
        <ChannelList />
    </Box>
    );
}

export default Conversation;
