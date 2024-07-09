import { useEffect, useState } from "react";
import { DateTools } from "../../tools/DateTools";
import { storeSocket } from "../../tools/Stores";
import Axios from "../../tools/Caller";
import { Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa6";

const fontSizeTime = {base: "15px", sm: "20px", md: "25px", lg: "30px", xl: "35px"}

export default function OnlineChat(props: {id: string}) {
    const [ connected, setConnected ] = useState<boolean>(false);
    const [ secEllapsed, setSecEllapsed ] = useState<number>(0);
    const [ intervalId, setIntervalId ] = useState<NodeJS.Timeout | null>(null);
    const [ loading, setLoading ] = useState<boolean>(true);
    const socket = storeSocket(state => state.socket);

    useEffect(() => {
        Axios.post("user/is_user_connected", {user_id: props.id})
        .then(
            response => {
                setConnected(response.data.connected);
                if (!response.data.connected)
                {
                    setSecEllapsed(DateTools.secFromNow(response.data.last_connection));
                    setIntervalId(setInterval(() => {setSecEllapsed(nb => nb + 1)}, 1000));
                }
            }
        )
        .catch(
            (err: any) => {
                console.warn(err);
            }
        )
        .finally(
            () => {
                setLoading(false);
            }
        )

    }, []);

    useEffect(() => {

        if (socket) {
            socket.on("connected", (data: any) => {
                if (props.id == data.id) {
                    setConnected(val => !val);
                    if (intervalId)
                        clearInterval(intervalId);
                    setIntervalId(null);
                }
            })

            socket.on("disconnected", (data: any) => {
                if (props.id == data.id) {
                    setConnected(val => !val);
                    setSecEllapsed(0);
                    setIntervalId(setInterval(() => setSecEllapsed((nb) => nb + 1), 1000));
                }
            })
        }

        return (() => {
            if (intervalId)
                clearInterval(intervalId);
            if (socket) {
                socket.off("connected");
                socket.off("disconnected");
            }
        })
    }, [socket, intervalId]);

    return (
        <Flex   className="OnlineChatInitFetch"
                w="35%">
            {loading? <Spinner justifySelf="center" color="purple" size="md"/>:
            <Flex   className="OnlineChat"
                    margin="3% 3%"
                    alignItems={"center"}
            >
                <Icon as={FaCircle} color={connected ? "green" : "red"} />
                <Flex   marginLeft={connected? "10%" : "35%"}
                        fontSize={fontSizeTime}
                        fontWeight={"bold"}
                >
                    {
                        connected ? "connected" :
                        <Flex flexDirection={"column"}>
                            <Text>Zzz...</Text>
                            <Text alignSelf={"center"} whiteSpace={"nowrap"}>
                                {DateTools.timeEllapsedStringFormatFromSec(secEllapsed)}
                            </Text>
                        </Flex>
                    }
                </Flex>
            </Flex>
            }
        </Flex>
    )
}