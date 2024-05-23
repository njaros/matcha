import { useState } from "react";
import { ISwipeUser } from "../../Interfaces";
import { Box, Button, Icon, Image, Text } from "@chakra-ui/react";
import { FcNext, FcPrevious } from "react-icons/fc"
import { SiIfixit } from "react-icons/si"
import { RiHeartAddFill } from "react-icons/ri";
import { BsStars } from "react-icons/bs";

const fontSizeName = {base: "25px", sm: "30px", md: "35px", lg: "40px", xl: "45px"}
const fontSizeLocation = {base: "15px", sm: "20px", md: "25px", lg: "30px", xl: "35px"}
const fontSizeLove = {base: "17px", sm: "22px", md: "25px", lg: "28px", xl: "33px"}


export default function DisplayProfile(props: {
    user: ISwipeUser,
    likeHandler: (e: any) => void,
    dislikeHandler: (e: any) => void})
{
    const [ photoIdx, setPhotoIdx ] = useState<number>(0);
    const nbPhotos = props.user.photos.length;

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
            {nbPhotos > 1 && <Button onClick={decrPhotoIdx}
                    bg="inherit"
                    marginRight="10px">
                <Icon boxSize={8} as={FcPrevious}/>
            </Button>}
            {nbPhotos > 1 && <Button onClick={incrPhotoIdx}
                    bg="inherit"
                    marginLeft="10px">
                <Icon boxSize={8} as={FcNext}/>
            </Button>}
        </Box>
        )
    }

    return <Box className="DisplayProfile"
                display="flex"
                width="80%"
                maxW="590px"
                flex={1}
                bgImage={props.user.photos[photoIdx].htmlSrcImg}
                backgroundSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
                borderRadius="25px"
                margin="2px"
                justifyContent="flex-start"
                flexDirection="column"
                overflowY="auto">
        {!props.user.love &&
        <Box    display="flex"
                flexDirection="row"
                margin="2% 5% 0 5%"
                justifyContent="space-between">
            <Icon color="gold" boxSize={8} as={BsStars}/>
            <Text   color="hsl(324, 70%, 45%)"
                    animation="wheelHueColor 10s infinite"
                    fontWeight="bold"
                    fontSize={fontSizeLove}
                    alignSelf="center"
                    transition="all 1s ease-out">
                This person likes you !
            </Text>
            <Icon color="gold" boxSize={8} as={BsStars}/>
        </Box>}
        <PhotosBrowser/>
        <Box    bgColor="gray"
                opacity="60%">
            <Box    className="nameAndAge"
                    marginLeft="10px"
                    display="flex" flexDirection="row"
                    fontSize={fontSizeName} color="white" fontWeight="bold">
                <Text   maxW="60%"
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
            <Box display="flex" margin="5% 5%" justifyContent="space-between" flexDirection="row">
                    <Button value={props.user.id} borderRadius="15px" onClick={props.dislikeHandler}>
                        <Icon boxSize={7} color="black" as={SiIfixit}/>
                    </Button>
                    <Button value={props.user.id} borderRadius="15px" onClick={props.likeHandler}>
                        <Icon boxSize={8} color="red.400" as={RiHeartAddFill}/>
                    </Button>
            </Box>
        </Box>
    </Box>
}
