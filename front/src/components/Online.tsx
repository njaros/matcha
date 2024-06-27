import { Flex, Icon, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { storeSocket } from "../tools/Stores";
import { DateTools } from "../tools/DateTools";
import { FaCircle } from "react-icons/fa6";


const fontSizeTime = {base: "15px", sm: "20px", md: "25px", lg: "30px", xl: "35px"}


/**
 * 
 * @param props id: the user id which checked for online.
 *              online: at initialisation of this component, set the online status to true or false.
 *              lastConnection: a date as ISOString format corresponding to the last time the user disconnected.
 * @returns     a JSX.Element displaying the online state of the user.
 */
export default function Online(props: {id: string, online: boolean, lastConnection: string}) {
    const [ connected, setConnected ] = useState<boolean>(props.online);
    const [ secEllapsed, setSecEllapsed ] = useState<number>(DateTools.secFromNow(props.lastConnection));
    const [ intervalId, setIntervalId ] = useState<NodeJS.Timeout | null>(() => {
        if (props.online)
            return null;
        return setInterval(() => {setSecEllapsed(nb => nb + 1)}, 1000)
    });
    const socket = storeSocket(state => state.socket);

    useEffect(() => {

        if (socket) {
            socket.on("connected", (data: any) => {
                if (props.id == data.id) {
                    setConnected(true);
                    if (intervalId)
                        clearInterval(intervalId);
                        setIntervalId(null);
                }
            })
        }

        if (socket) {
            socket.on("disconnected", (data: any) => {
                if (props.id == data.id) {
                    setConnected(false);
                    setSecEllapsed(0);
                    setIntervalId(setInterval(() => setSecEllapsed((nb) => nb + 1), 1000));
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

    useEffect(() => {

        return (() => {
            if (intervalId)
                clearInterval(intervalId);
        })

    }, [])

    return (
        <Flex   className="online"
                                margin="3% 3%"
                                alignItems={"center"}
                        >
                            <Icon as={FaCircle} color={connected ? "green" : "red"} />
                            <Text   marginLeft={"4%"}
                                    fontSize={fontSizeTime}
                                    fontWeight={"bold"}
                                    color="white"
                            >
                                {
                                    connected ? "connected" :
                                    DateTools.timeEllapsedStringFormatFromSec(secEllapsed)
                                }
                            </Text>
                        </Flex>
    )
}