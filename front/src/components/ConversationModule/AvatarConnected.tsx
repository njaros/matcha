import { Avatar, Flex } from "@chakra-ui/react";
import OnlineChat from "./OnlineChat";

export default function AvatarConnected(props: {id: string, src: string | undefined}) {
    return (
        <Flex>
            <Avatar marginLeft={'15px'} src={props.src} />
            <Flex placeSelf={"flex-end"} marginLeft={"-15px"} zIndex={1}>
                <OnlineChat id={props.id}/>
            </Flex>
        </Flex>
    )
}
