import { useEffect, useState } from "react";
import { ISwipeUser, IPhoto } from "../../Interfaces";
import Axios from "../../tools/Caller";
import { Box, Button, Circle, Icon, Image, Text, Spinner, useToast } from "@chakra-ui/react";
import { storeFilter, storeSocket } from "../../tools/Stores";
import { DateTools } from "../../tools/DateTools";
import { RiSortAsc } from "react-icons/ri"
import DisplayProfile from "./DisplayProfile";
import ReportTrigger from "../ReportTrigger";

const fontSizeNobody = {base: "13px", sm: "20px", md: "25px", lg: "25px", xl: "25px"}

const Swipe = () => {
    const toast = useToast()
    const socket = storeSocket(state => state.socket)
    const [ swipeList, setSwipeList ] = useState<string[]>([]);
    const [ index, setIndex ] = useState<number>(0);
    const { filter, updateFilter } = storeFilter();
    const [ sort, setSort ] = useState<string>("none");
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ startPage, setStartPage ] = useState<boolean>(true);
    const [ swipeUser, setSwipeUser ] = useState<ISwipeUser>(
        {
            id: "",
            username: "",
            age: 0,
            gender: "",
            rank: 0,
            biography: "",
            location: "",
            photos: [],
            hobbies: [],
            love: false,
            loved: false
        }
    );

    function getPosInfo(location: any)
    {
        if (location != null && location != undefined)
        {
            return location.city != undefined ?
            location.city :
            location.village != undefined ?
            location.village :
            location.town != undefined ?
            location.town :
            location.county != undefined ?
            location.county :
            location.state != undefined ?
            location.state : 
            location.country != undefined ?
            location.country : "";
        }
        return "";
    }

    function get_user_profile() {
        setLoading(true);
        Axios.post("/user/get_user_profile_from_swipe", { user_id: swipeList[index]}).then(
            response => {
                const photos: IPhoto[] = [];
                if (response.data.photos.length > 0)
                {
                    response.data.photos.map((photo: any) => {
                        photos.push({
                            id: photo.id,
                            htmlSrcImg: "data:".concat(photo.mime_type)
                            .concat(";base64,")
                            .concat(photo.binaries),
                            main: photo.main
                        })
                    })
                    photos.sort((a, b) => {
                        return (b.main ? 1 : 0) - (a.main ? 1 : 0)
                    })
                }
                else photos.push({
                    id: "0",
                    htmlSrcImg: "default-avatar.png",
                    main: true
                })
                setSwipeUser({
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
                    loved: false
                })
            }
        ).catch(
            err => {
                console.warn(err);
            }
        ).finally(
            () => {
                setLoading(false);
            }
        )
    }

    function get_swipe_list() {
        setLoading(true);
        Axios.post("/swipe/get_swipe_list", {...filter, sort: sort}).then(
            response => {
                const newSwipeList = [];
                for (let i = 0; i < response.data.length; ++i)
                    newSwipeList.push(response.data[i].id);
                setSwipeList(newSwipeList);
            }
        ).catch(
            err => {
                console.log(err);
            }
        ).finally(
            () => {
                setIndex(0);
                setLoading(false);
                setStartPage(false);
            }
        )
    }

    useEffect(() => {
        get_swipe_list();
    }, [sort])

    useEffect(() => {
        if (socket) {
            socket.on("send_like", () => {
                console.log("from send_like");
                toast({title: "hello", description: "someone like U"})
            });
            console.log("swipe socket listener created")
        }

        return (() => {
            if (socket) {
                socket.off("send_like")
            }
        })
    })

    useEffect(() => {
        if (swipeList.length > 0)
            get_user_profile();
        else
            setSwipeUser({
                id: "",
                username: "",
                age: 0,
                gender: "",
                rank: 0,
                biography: "",
                location: "",
                photos: [],
                hobbies: [],
                love: false,
                loved: false
            })
    }, [swipeList, index])

    const handleSort = (e: any) => {
        if (e.target.value == sort)
            setSort("none")
        else
            setSort(e.target.value)
    }

    function incrementIndex() {
        if (index >= swipeList.length - 1)
        {
            get_swipe_list();
        }
        else
        {
            setIndex(idx => idx + 1);
        }
    }

    const likeHandler = (e: any) => {
        Axios.post("swipe/like_user", {"target_id": e.currentTarget.value}).then(
            response => {
                console.log(response);
            }
        ).catch(
            err => {
                console.warn(err);
            }
        ).finally(
            () => {incrementIndex();}
        )
    }

    const dislikeHandler = (e: any) => {
        Axios.post("swipe/dislike_user", {"target_id": e.currentTarget.value}).then(
            response => {
                console.log(response);
            }
        ).catch(
            err => {
                console.warn(err);
            }
        ).finally(
            () => {incrementIndex();}
        )
    }

    return (
    <Box flex={1} className="Swipe" w="100%" display="flex" alignItems="center" flexDirection="column">
        <Box    className="SortButtons"
                w={"100%"}
                display={"flex"}
                flexDirection={"row"}
                margin="5% 0"
                justifyContent={"space-evenly"}>
            <ReportTrigger user_id={swipeUser.id} optionAction={incrementIndex}/>
            <Button colorScheme={sort == "age" ? "purple_palet": "gray"}
                    value={"age"}
                    onClick={handleSort}>Age</Button>
            <Button colorScheme={sort == "distance" ? "purple_palet": "gray"}
                    value={"distance"}
                    onClick={handleSort}>Distance</Button>
            <Button colorScheme={sort == "rank" ? "purple_palet": "gray"}
                    value={"rank"}
                    onClick={handleSort}>Rank</Button>
            <Button colorScheme={sort == "tags" ? "purple_palet": "gray"}
                    value={"tags"}
                    onClick={handleSort}>Tags</Button>
        </Box>
        {loading && <Box display="flex" flex={1} justifyContent="center" alignItems="center">
            <Spinner    
                        size="xl"
                        color="blue.500"
                        emptyColor="gray"
                        speed="0.8s"
                        thickness="4px"
            />
        </Box>}
        {swipeUser.id != "" && !loading &&
            <DisplayProfile user={swipeUser} likeHandler={likeHandler} dislikeHandler={dislikeHandler} />
        }
        {swipeUser.id == "" && !loading && !startPage &&
            <Box    flex={1} display="flex" w="80%" maxW="590px" alignItems="start"
                    justifyContent="center"
                    borderRadius="25px"
                    bgImage="cat.jpeg"
                    bgRepeat="no-repeat"
                    bgPosition="center"
                    bgSize="cover">
                <Text   fontSize={fontSizeNobody}
                        fontWeight="bold"
                        margin="5%"
                        color="white">
                    Nobody around you belong to your wishes...
                </Text>
            </Box>
        }
    </Box>);
}

export default Swipe;
