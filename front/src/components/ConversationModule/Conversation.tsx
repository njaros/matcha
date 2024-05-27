import { useEffect, useState, useRef } from "react";
import { storeSocket, storeRoom, storeMe, storeRoomList, storeConvBool } from "../../tools/Stores";
import { Box, Button, FormControl, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Axios from "../../tools/Caller";
import ChannelList from "./channel";
import Chatbox from "./Chatbox";
import { RoomList } from "../../tools/interface";

function Conversation(){
    
    const socket = storeSocket(state => state.socket)
    const [room, updateRoom] = storeRoom(state => [state.room, state.updateRoom]);
    const [roomList, updateRoomList] = storeRoomList(state => [state.roomList, state.updateRoomList])
    const [convBool, updateConvBool] = storeConvBool(state => [state.convBool, state.updateConvBool])
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
