import { createRef, useEffect, useRef, useState } from "react";
import { ISwipeUser } from "../../Interfaces";
import { Box, Button, Icon, Image, Tag, Text } from "@chakra-ui/react";
import { FcNext, FcPrevious } from "react-icons/fc"
import { SiIfixit } from "react-icons/si"
import { RiHeartAddFill } from "react-icons/ri";
import { BsStars } from "react-icons/bs";
import { BiSolidUserDetail } from "react-icons/bi";

const fontSizeName = {base: "25px", sm: "30px", md: "35px", lg: "40px", xl: "45px"}
const fontSizeLocation = {base: "15px", sm: "20px", md: "25px", lg: "30px", xl: "35px"}
const fontSizeLove = {base: "17px", sm: "22px", md: "25px", lg: "28px", xl: "33px"}


export default function DisplayProfile(props: {
    user: ISwipeUser,
    likeHandler: (e: any) => void,
    dislikeHandler: (e: any) => void})
{
    const [ photoIdx, setPhotoIdx ] = useState<number>(0);
    const [ detail, setDetail ] = useState<boolean>(false);
    const nbPhotos = props.user.photos.length;
    const userInfoRef = useRef<HTMLElement>();
    const loveRef = useRef<HTMLElement>();
    const buttonsRef = useRef<HTMLElement>();

    function incrPhotoIdx()
    {
        if (photoIdx >= nbPhotos - 1)
            setPhotoIdx(0);
        else
            setPhotoIdx(photoIdx + 1);
    }

    function decrPhotoIdx()
    {
        if (photoIdx <= 0)
            setPhotoIdx(nbPhotos - 1);
        else
            setPhotoIdx(photoIdx - 1)
    }

    const PhotosBrowser = () => {
        return (
        <Box    display="flex"
                flex={1}
                flexDirection="row"
                alignItems="center"
                opacity="35%"
                justifyContent="space-between">
            {nbPhotos > 1 && !detail && <Button onClick={decrPhotoIdx}
                    bg="inherit"
                    marginRight="10px">
                <Icon boxSize={8} as={FcPrevious}/>
            </Button>}
            {nbPhotos > 1 && !detail && <Button onClick={incrPhotoIdx}
                    bg="inherit"
                    marginLeft="10px">
                <Icon boxSize={8} as={FcNext}/>
            </Button>}
        </Box>
        )
    }

    function HobbiesDisplay() {
        if (props.user.hobbies != null)
        {
            return (
                <Box    display="flex" justifyContent="flex-start" flexDirection="column" margin="5% 0">
                    <Text   marginBottom="3%" textDecoration="underline" fontWeight="bold" alignSelf="center">I like</Text>
                    <Box    display="flex" flexDirection="row" justifyContent="space-evenly" flexWrap="wrap">
                    {props.user.hobbies.map((hobby: any, key) => {
                        return (
                            <Tag key={key} margin="1%" color="white" bgColor="black">{hobby.name}</Tag>
                        )
                    })}
                    </Box>
                </Box>
            )
        }
    }

    function Biography() {
        if (props.user.biography != "")
            return (
                <Box    display="flex"
                        bgColor="white"
                        flexDirection="column"
                        alignItems="center"
                        border="gray"
                        borderStyle="ridge"
                        borderRadius="15px"
                        margin="3%"
                        padding="0 3%">
                    <Text textDecoration="underline" fontWeight="bold" marginTop="3%">About me</Text>
                    <Text>{props.user.biography}</Text>
                    <HobbiesDisplay />
                    <Text alignSelf="center" margin="1% 5%" fontWeight="bold">My ranking: {props.user.rank}</Text>
                    <Text margin="1% 5%" alignSelf="center" fontWeight="bold">My gender: {props.user.gender}</Text>
                </Box>
            )
    }

    function detailHandler() {
        setDetail(!detail);
    }

    useEffect(() => {
        console.log(loveRef);
    }, [loveRef])

    return <Box className="DisplayProfile"
                display="flex"
                width="80%"
                maxW="590px"
                flex={1}
                bgImage={props.user.photos[photoIdx].htmlSrcImg}
                backgroundSize="cover" bgPosition="center" bgRepeat="no-repeat"
                borderRadius="25px"
                margin="2px"
                justifyContent="flex-end"
                flexDirection="column"
                overflowY="auto"
                ref={userInfoRef}
                >
        <Box    display="flex"
                flexDirection="row"
                margin="2% 5% 2% 5%"
                justifyContent="space-between"
                alignContent="center"
                hidden={props.user.love}
                ref={loveRef}>
            <Icon color="gold" boxSize={8} as={BsStars}/>
            <Text   color="hsl(324, 70%, 45%)"
                    animation="wheelHueColor 10s infinite"
                    fontWeight="bold"
                    fontSize={fontSizeLove}
                    >
                This person likes you !
            </Text>
            <Icon color="gold" boxSize={8} as={BsStars}/>
        </Box>
        <PhotosBrowser/>
        <Box    bgColor="gray"
                opacity="60%"     
                >
            <Box    className="displayUserInfo"
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-start"
                    maxHeight={`calc(${userInfoRef.current?.clientHeight}px - \
                        ${loveRef.current?.clientHeight}px - \
                        ${buttonsRef.current?.clientHeight}px - 50px)`}
                    overflowY="auto"
                    >
                <Box    className="nameAndAge"
                        marginLeft="10px"
                        display="flex" flexDirection="row"
                        fontSize={fontSizeName} color="white" fontWeight="bold">
                    <Text   maxW="60%" marginRight="3%"
                            overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis"
                            >{props.user.username}</Text>
                    <Text   opacity="50%">
                        {props.user.age}
                    </Text>
                </Box>
                <Text   marginLeft="10px"
                        color="white"
                        fontSize={fontSizeLocation}
                        fontWeight="bold">{props.user.location}</Text>
                <Box    className="detail"
                        display= "flex"
                        hidden={!detail}
                        flexDirection="column"
                        >
                    <Biography />
                </Box>
            </Box>
            <Box    ref={buttonsRef} display="flex" margin="5% 5%" justifyContent="space-between" flexDirection="row">
                    <Button value={props.user.id} borderRadius="15px" onClick={props.dislikeHandler}>
                        <Icon boxSize={7} color="black" as={SiIfixit}/>
                    </Button>
                    <Button borderRadius="15px" colorScheme={detail ? "matchaPink" : "gray"} onClick={detailHandler}>
                        <Icon boxSize={9} as={BiSolidUserDetail} />
                    </Button>
                    <Button value={props.user.id} borderRadius="15px" onClick={props.likeHandler}>
                        <Icon boxSize={8} color="red.400" as={RiHeartAddFill}/>
                    </Button>
            </Box>
        </Box>
    </Box>
}
