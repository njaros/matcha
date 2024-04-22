import React, {useEffect, useState} from "react";
import { storeSocket, storeRoom, storeMe, storeRoomList } from "../../tools/Stores";
import Axios from "../../tools/Caller";

function ChannelList(){

    const roomList = storeRoomList(state => state.roomList)
    const room = storeRoom(state => [state.room, state.updateRoom])
    console.log('from channel list', roomList)
    console.log(roomList)
    
    if (!roomList)
        return <div>No conversation yet...</div>
    return (
        <>
            <h2>Liste des conversations</h2>
            <ul>
                {roomList.map((room, index) => (
                        <li key={index}>
                            <div>room: {room.name}</div>
                        </li>
                    )
                )}
            </ul>
        </>
    )
}

export default ChannelList