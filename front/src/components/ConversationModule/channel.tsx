import React, {useEffect, useState} from "react";
import { storeSocket, storeRoom, storeMe, storeRoomList } from "../../tools/Stores";
import Axios from "../../tools/Caller";

function ChannelList(){

    const roomList = storeRoomList(state => state.roomList)
    console.log('from channel list', roomList)
    return (
        <>
            
        </>
    )
}

export default ChannelList