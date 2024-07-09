import { Button, Divider, Flex, Icon, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { MdOutlineNotificationsActive, MdOutlineNotifications } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { storeSocket } from "../../tools/Stores";
import { useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";


const bodySize = {base: "160px", sm: "200px", md: "280px", lg: "320px", xl: "400px"}
const itemSize = {base: "45px", sm: "50px", md: "70px", lg: "70px", xl: "70px"}
const textSize = {base: "16px", sm: "17px", md: "17px", lg: "18px", xl: "18px"}
const buttonSize = {base: "35px", sm: "40px", md: "40px", lg: "40px", xl: "40px"}

export default function Notification() {
    const navigate = useNavigate();
    const scrollToBottomRef = useRef<HTMLDivElement>(null);
    const { onOpen, onClose, isOpen } = useDisclosure()
    const [ notifList, setNotifList ] = useState<{content: string, type: string, id: string}[]>([])
    const [ nbNews, setNbNews ] = useState<number>(0);
    const [ oldNbNews, setOldNbNews ] = useState<number>(0);
    const socket = storeSocket(state => state.socket);

    useEffect(() => {
        if (socket) {
            socket.on("liked", (data: any) => {
                setNotifList((list) => [...list, {
                    content: "You got a new like !",
                    type: "relation",
                    id: data.id
                }]);
                handleViewedItems();
            })

            socket.on("viewed", (data: any) => {
                setNotifList((list) => [...list, {
                    content: "Someone viewed your profile",
                    type: "info",
                    id: ""
                }]);
                handleViewedItems();
            })

            socket.on("match", (data: any) => {
                setNotifList((list) => [...list, {
                    content: "You just matched !",
                    type: "relation",
                    id: data.id
                }]);
                handleViewedItems();
            })

            socket.on("unliked", (data: any) => {
                setNotifList((list) => [...list, {
                    content: "You lost a like",
                    type: "relation",
                    id: data.id
                }]);
                handleViewedItems();
            })

        }

        return (() => {
            if (socket) {
                socket.off("liked");
                socket.off("unliked");
                socket.off("match");
                socket.off("viewed");
            }
        })

    }, [socket, isOpen])

    useEffect(() => {
        scrollDown();
    }, [oldNbNews])

    function clear() {
        setNbNews(0);
        setOldNbNews(0);
        setNotifList([]);
        onClose();
    }

    function handleViewedItems() {
        if (isOpen)
            setOldNbNews((nb) => nb + 1);
        else
            setNbNews((nb) => nb + 1);
    }

    function pop(idx: number) {
        setNotifList([...notifList.filter((value, index) => {
            return index != idx;
        })]);
        if (notifList.length - idx <= oldNbNews)
            setOldNbNews((nb) => nb - 1);
    }

    function openPopover() {
        if (!isOpen) {
            setOldNbNews((nb) => nbNews);
            setNbNews((nb) => 0);
        }
        scrollDown();
    }

    function scrollDown() {
        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollTop = scrollToBottomRef.current.scrollHeight;
        }
    }

    function InfoItem(props: {content: string, index: number}) {
        return (
            <Flex   alignItems={"center"}
                    borderRadius={"15px"}
                    h={itemSize}
                    justifyContent={"space-between"}
                    bgColor={notifList.length - props.index <= oldNbNews ?
                        "#A659EC" :
                        "#edf2f7"
                    }
            >
                <Text marginLeft={"13px"}>{props.content}</Text>
                <Button onClick={() => pop(props.index)}
                        borderRadius={"15px"}
                        margin={"0 10px 0 5px"}
                        h={buttonSize}
                        w={buttonSize}
                        bgColor={"white"}
                >
                    <Icon as={RiDeleteBin5Fill}/>
                </Button>
            </Flex>
        )
    }

    function RelationItem(props: {content: string, index: number, id: string}) {
        return (
            <Flex   alignItems={"center"}
                    borderRadius={"15px"}
                    h={itemSize}
                    justifyContent={"flex-end"}
                    bgColor={notifList.length - props.index <= oldNbNews ?
                        "#A659EC" :
                        "#edf2f7"
                    }
            >
                <Text flex={1} marginLeft={"13px"}>{props.content}</Text>
                <Button onClick={() => {
                    onClose();
                    navigate(`/other_profile/${props.id}`);
                }}
                        borderRadius={"15px"}
                        marginRight={"10px"}
                        h={buttonSize}
                        w={buttonSize}
                        bgColor={"white"}>
                    <Icon as={FaMagnifyingGlass} />
                </Button>
                <Button onClick={() => pop(props.index)}
                        borderRadius={"15px"}
                        marginRight={"10px"}
                        h={buttonSize}
                        w={buttonSize}
                        bgColor={"white"}
                >
                    <Icon as={RiDeleteBin5Fill}/>
                </Button>
            </Flex>
        )
    }

    function DisplayList() {
        return (
            <>
            {notifList.map((elt, index, array) => {
                return (
                    <Flex key={index} flexDirection={"column"}>
                        {
                            elt.type == "info" ? <InfoItem content={elt.content} index={index} /> :
                            elt.type == "relation" ? <RelationItem content={elt.content} index={index} id={elt.id} /> :
                            <></>
                        }
                        {index + 1 < array.length && <Divider   margin="4px 0"
                                                                width={"80%"}
                                                                alignSelf={"center"}
                                                                borderWidth={"1px"}
                                                                borderRadius={"full"}
                                                                borderColor={"#A659EC"}/>}
                    </Flex>
                )
            })}
            </>
        )
    }

    return (
        <Flex>
            <Popover    isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
            >
                <PopoverTrigger>
                    <Icon onClick={openPopover}
                        as={nbNews == 0 ?
                        MdOutlineNotifications :
                        MdOutlineNotificationsActive}
                    />
                </PopoverTrigger>
                <PopoverContent fontSize={textSize}
                                borderRadius={"20px"}
                >
                    <PopoverArrow />
                    <PopoverHeader display="flex" justifyContent={"center"}>
                        <Text   fontWeight={"bold"}>Notifications</Text>
                    </PopoverHeader>
                    {notifList.length != 0 &&
                    <PopoverBody    maxH={bodySize}
                                    ref={scrollToBottomRef}
                                    display="flex"
                                    flexDirection={"column"}
                                    overflowY={"auto"}
                    >
                        <DisplayList />
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