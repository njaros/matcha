import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { storeSocket } from "../tools/Stores";

/**
 * 
 * @param props id: the user id which checked for online.
 *              online: at initialisation of this component, set the online status to true or false.
 *              lastConnection: a date as ISOString format corresponding to the last time the user disconnected.
 * @returns     a JSX.Element displaying the online state of the user.
 */
export default function Online(props: {id: string, online: boolean, lastConnection: string}) {
    const [ connected, setConnected ] = useState<boolean>(props.online);
    const [ lastConnection, setLastConnection ] = useState<string>(props.lastConnection);
    const socket = storeSocket(state => state.socket);

    useEffect(() => {
        if (socket) {
            socket.on("connected", (data: any) => {
                if (props.id == data.id) {
                    setConnected(true)
                }
            })
        }

        if (socket) {
            socket.on("disconnected", (data: any) => {
                if (props.id == data.id) {
                    setConnected(false)
                    setLastConnection("just disconnected")
                }
            })
        }

        return (() => {
            if (socket) {
                socket.off("connected");
                socket.off("disconnected");
            }
        })

    }, [socket])

    return (
        <Flex>

        </Flex>
    )
}