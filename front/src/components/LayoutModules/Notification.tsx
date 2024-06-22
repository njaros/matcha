import { Button, Flex, Icon, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { MdOutlineNotificationsActive, MdOutlineNotifications } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";


const bodySize = {base: "150px", sm: "200px", md: "270px", lg: "320px", xl: "400px"}

export default function Notification() {
    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const { onOpen, onClose, isOpen } = useDisclosure()
    const [ notifList, setNotifList ] = useState<{content: string, type: string, id: string}[]>([
        {content: "hello dear, do you like cheese1 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese2 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese3 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese4 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese5 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese6 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese7 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese8 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese9 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese10 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese11 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese12 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese13 ?", type: "info", id: ""},
        {content: "hello dear, do you like cheese14 ?", type: "info", id: ""}
    ])
    const [ nbNews, setNbNews ] = useState<number>(5);
    const [ oldNbNews, setOldNbNews ] = useState<number>(0);

    function InfoItem(props: {content: string, index: number}) {
        return (
            <Flex   alignItems={"center"}
                    justifyContent={"space-between"}
                    bgColor={notifList.length - props.index <= oldNbNews ?
                        "blue" :
                        "red"
                    }
            >
                <Text>{props.content}</Text>
                <Button onClick={() => pop(props.index)}>
                    <Icon as={RiDeleteBin5Fill}/>
                </Button>
            </Flex>
        )
    }

    function clear() {
        setNotifList([]);
    }

    function pop(idx: number) {
        setNotifList([...notifList.filter((value, index) => {
            return index != idx;
        })])
    }

    function scrollDown() {
        if (!isOpen) {
            setOldNbNews(nbNews);
            setNbNews(0);
        }
        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollTop = scrollToBottomRef.current.scrollHeight;
        }
    }

    return (
        <Flex>
            <Popover    isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
            >
                <PopoverTrigger>
                    <Button onClick={scrollDown}>
                        <Icon as={nbNews == 0 ?
                            MdOutlineNotifications :
                            MdOutlineNotificationsActive}
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    {notifList.length != 0 &&
                    <PopoverBody    maxH={bodySize}
                                    ref={scrollToBottomRef}
                                    display="flex"
                                    flexDirection={"column"}
                                    overflowY={"auto"}
                    >
                        {notifList.map(
                            (elt, index) => {
                                if (elt.type == "info")
                                    return <InfoItem content={elt.content} index={index}/>
                            }
                        )}
                    </PopoverBody>}
                    <PopoverFooter>
                        <Flex justifyContent={"space-evenly"}>
                            {notifList.length == 0 ?
                            <Text>No notification</Text> :
                            <Button onClick={clear}>
                                Clear all
                            </Button>
                            }
                            <Button onClick={() => onClose()}>Close</Button>
                        </Flex>
                    </PopoverFooter>
                </PopoverContent>
            </Popover>
        </Flex>
    )
}