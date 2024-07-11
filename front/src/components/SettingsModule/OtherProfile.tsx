import { useEffect, useRef, useState } from "react";
import { IPhoto, ISwipeUser } from "../../Interfaces";
import { Box, Button, Icon, Text, Spinner, Tag, Flex } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "../../tools/Caller";
import { DateTools } from "../../tools/DateTools";
import { getPosInfo } from "../../tools/Thingy";
import { storeMe } from "../../tools/Stores";
import ReturnButton from "./ReturnButton";
import ReportTrigger from "../ReportTrigger";
import { FcNext, FcPrevious } from "react-icons/fc"
import { RiHeartAddFill } from "react-icons/ri";
import { BsFillHeartbreakFill } from "react-icons/bs";
import { BsStars } from "react-icons/bs";
import { BiSolidUserDetail } from "react-icons/bi";
import Online from "../Online";
import { IoChevronBack } from "react-icons/io5";

const fontSizeName = {base: "25px", sm: "30px", md: "35px", lg: "40px", xl: "45px"}
const fontSizeLocation = {base: "15px", sm: "20px", md: "25px", lg: "30px", xl: "35px"}
const fontSizeLove = {base: "17px", sm: "22px", md: "25px", lg: "28px", xl: "33px"}

function parsePhotosFromBack(toParse: {id: string, binaries: string, mime_type: string}[])
{
    const parsed: IPhoto[] = [];
    if (toParse.length > 0)
    {
        toParse.map((photo: any) => {
            parsed.push({
                id: photo.id,
                htmlSrcImg: "data:".concat(photo.mime_type)
                .concat(";base64,")
                .concat(photo.binaries),
                main: photo.main
            })
        })
        parsed.sort((a, b) => {
            return (b.main ? 1 : 0) - (a.main ? 1 : 0)
        })
    }
    else parsed.push({
        id: "0",
        htmlSrcImg: "/default-avatar.png",
        main: true
    })
    return parsed;
}

export default function OtherProfile()
{
    const userParam = useParams().id;
    const me = storeMe(state => state.me)
    const [ user, setUser ] = useState<ISwipeUser>()
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ photoIdx, setPhotoIdx ] = useState<number>(0);
    const [ detail, setDetail ] = useState<boolean>(false);
    const [ nbPhotos, setNbPhotos ] = useState<number>(0);
    const userInfoRef = useRef<HTMLDivElement>(null);
    const loveRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userParam != undefined)
        {
            setLoading(true)
            Axios.post("user/get_user_profile", { user_id: userParam }).then(
                response => {
                    const photos = parsePhotosFromBack(response.data.photos);
                    setNbPhotos(photos.length);
                    setUser({
                        id: response.data.id,
                        username: response.data.username,
                        age: DateTools.ageFromDate(response.data.birthdate),
                        gender: response.data.gender,
                        rank: response.data.rank,
                        biography: response.data.biography,
                        location: getPosInfo(response.data.location),
                        photos: photos,
                        hobbies: response.data.hobbies,
                        love: response.data.love,
                        loved: response.data.loved,
                        last_connection: response.data.last_connection,
                        connected: response.data.connected
                    });
                }
            ).catch(
                err => {
                    console.warn(err)
                }
            ).finally(
                () => {setLoading(false);}
            )
        }
    }, [])

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
                className="photoBrowser"
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
        if (user != undefined && user.hobbies != null)
        {
            return (
                <Box    display="flex" justifyContent="flex-start" flexDirection="column" margin="5% 0">
                    <Text   marginBottom="3%" textDecoration="underline" fontWeight="bold" alignSelf="center">I like</Text>
                    <Box    display="flex" flexDirection="row" justifyContent="space-evenly" flexWrap="wrap">
                    {user.hobbies.map((hobby: any, key) => {
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
        if (user != undefined)
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
                    <Text>{user.biography}</Text>
                    <HobbiesDisplay />
                    <Text alignSelf="center" margin="1% 5%" fontWeight="bold">My ranking: {user.rank}</Text>
                    <Text margin="1% 5%" alignSelf="center" fontWeight="bold">My gender: {user.gender}</Text>
                </Box>
            )
    }

    function detailHandler() {
        setDetail(!detail);
    }

    function like(e:any) {
        Axios.post("swipe/like_user", {target_id: e.currentTarget.value}).then(
            () => {
                if (user) {
                    let newUser = {...user};
                    newUser.loved = true;
                    setUser(newUser);
                }
            }
        ).catch(
            err => {
                console.warn(err)
            }
        )
    }

    function unlike(e:any) {
        Axios.post("relationship/remove_like", {user_id: e.currentTarget.value}).then(
            () => {
                if (user) {
                    let newUser = {...user};
                    newUser.loved = false;
                    setUser(newUser);
                }
            }
        ).catch(
            err => {
                console.warn(err)
            }
        )
    }

    function FooterButtons() {
        if (user != undefined)
        {
            return (
            <Box    ref={buttonsRef} display="flex" margin="5% 5%" justifyContent="space-between" flexDirection="row">
                    {me && me.id != user.id && <ReportTrigger user_id={user.id} optionAction={() => navigate(-1, {replace: true})} />}
                    <Button borderRadius="15px" colorScheme={detail ? "matchaPink" : "gray"} onClick={detailHandler}>
                        <Icon boxSize={9} as={BiSolidUserDetail} />
                    </Button>
                    {me && me.id != user.id && 
                    <>
                        {user.loved ?
                            <Button value={user.id} borderRadius="15px" onClick={unlike}>
                                <Icon boxSize={8} color="red.400" as={BsFillHeartbreakFill} />
                            </Button> :
                            <Button value={user.id} borderRadius="15px" onClick={like}>
                                <Icon boxSize={8} color="red.400" as={RiHeartAddFill}/>
                            </Button>
                        }
                    </>
                    }
            </Box>)
        }
    }

    return (
    <Box flex={1} w="100%" display={"flex"} flexDirection={"column"} justifyContent={"flex-end"} alignItems={"center"}>
        <Flex 
            flexDirection={'row'}
            placeSelf={'self-start'}
            paddingLeft={'15px'}
            marginTop={'15px'}
        >
            <Box 
                alignSelf={'center'}
            >
                <ReturnButton to={-1}/>
            </Box>
             <Flex
                fontSize={'xx-large'}
                alignSelf={'center'}
                margin={'0px 5px'}
                fontWeight={'bold'}
                paddingLeft={'5px'}
            >
                {
                    loading ? <Spinner color="blue.500" /> :
                    user?.love && user.loved ? "Match profile" :
                    user?.love ? "Liker profile" :
                    user?.loved ? "Liked profile" :
                    "Other profile"
                }
            </Flex>
        </Flex>
        {loading ? <Spinner  margin="60% 0" size={"xl"} borderWidth={"5px"} color="blue.500" justifySelf={"center"} alignSelf={"center"}/> : user != undefined ?
            <Box    className="DisplayProfile"
                    display="flex"
                    width="80%"
                    maxW="590px"
                    flex={1}
                    bgImage={user.photos[photoIdx].htmlSrcImg}
                    backgroundSize="cover" bgPosition="center" bgRepeat="no-repeat"
                    borderRadius="25px"
                    margin="2px"
                    justifyContent="flex-end"
                    flexDirection="column"
                    overflowY="auto"
                    ref={userInfoRef}>
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
                                    >{user.username}</Text>
                            <Text   opacity="50%">
                                {user.age}
                            </Text>
                        </Box>
                        <Online id={user.id} lastConnection={user.last_connection} online={user.connected} />
                        <Text   className="location"
                                marginLeft="10px"
                                color="white"
                                fontSize={fontSizeLocation}
                                fontWeight="bold">{user.location}
                        </Text>
                        <Box    className="detail"
                                display= "flex"
                                hidden={!detail}
                                flexDirection="column"
                                >
                            <Biography />
                        </Box>
                    </Box>
                    <FooterButtons />
                </Box>
            </Box> :
            <Text>Nothing to display</Text>}
        </Box>)
}
