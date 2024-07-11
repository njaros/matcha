import { useEffect, useState } from "react";
import { DateTools } from "../../tools/DateTools";
import { storeSocket } from "../../tools/Stores";
import Axios from "../../tools/Caller";
import { Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa6";

const fontSizeTime = {base: "15px", sm: "20px", md: "25px", lg: "30px", xl: "35px"}

export default function OnlineChat(props: {id: string}) {
    const [ connected, setConnected ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(true);
    const socket = storeSocket(state => state.socket);

    useEffect(() => {
        Axios.post("user/is_user_connected", {user_id: props.id})
        .then(
            response => {
                setConnected(response.data.connected);
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
            socket.on("connected-" + props.id, () => {
                setConnected(val => !val);
            })

            socket.on("disconnected-" + props.id, () => {
                setConnected(val => !val);
            })
        }

        return (() => {
            if (socket) {
                socket.off("connected-" + props.id);
                socket.off("disconnected-" + props.id);
            }
        })
    }, [socket]);

    return (
        <Flex   className="OnlineChat">
            {loading?   <Spinner justifySelf="center" color="purple" size="md"/>:
                        <Icon borderWidth={"3px"} borderRadius={"full"} borderColor={"white"} as={FaCircle} color={connected ? "green" : "red"} />
            }
        </Flex>
    )
}