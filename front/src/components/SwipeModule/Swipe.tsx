import { useEffect, useRef, useState } from "react";
import { ISwipeUser, ISwipeFilter, IPhoto } from "../../Interfaces";
import Axios from "../../tools/Caller";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { storeFilter } from "../../tools/Stores";
import { DateTools } from "../../tools/DateTools";

const Swipe = () => {
    const [ swipeList, setSwipeList ] = useState<string[]>([]);
    const [ index, setIndex ] = useState<number>(0);
    const { filter, updateFilter } = storeFilter()
    const [ sort, setSort ] = useState<string>("none")
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
            love: false
        }
    )

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
        console.log("id = ", swipeList[0]);
        Axios.post("/user/get_user_profile", { user_id: swipeList[index]}).then(
            response => {
                console.log(response.data);
                const photos: IPhoto[] = [];
                if (response.data.photos != null)
                {
                    response.data.photos.map((photo: any) => {
                        photos.push({
                            id: photo.id,
                            htmlSrcImg: "data:".concat(photo.mimetype)
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
                    love: response.data.love
                })
            }
        ).catch(
            err => {
                console.warn(err);
            }
        )
    }

    function get_swipe_list() {
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
            }
        )
    }

    useEffect(() => {
        get_swipe_list();
    }, [])

    useEffect(() => {
        if (swipeList.length > 0)
            get_user_profile();
    }, [swipeList, index])

    const likeHandler = (e: any) => {
        Axios.post("swipe/like_user", {"target_id": e.target.value}).then(
            response => {
                console.log(response);
            }
        ).catch(
            err => {
                console.warn(err);
            }
        )
        if (index == swipeList.length - 1)
        {
            get_swipe_list();
        }
        else
        {
            setIndex(idx => idx + 1);
        }
    }

    const dislikeHandler = (e: any) => {
        Axios.post("swipe/dislike_user", {"target_id": e.target.value}).then(
            response => {
                console.log(response);
            }
        ).catch(
            err => {
                console.warn(err);
            }
        )
        if (index == swipeList.length - 1)
        {
            get_swipe_list();
        }
        else
        {
            setIndex(idx => idx + 1);
        }
    }

    return (
    <Box flexGrow={1} className="Swipe" height="100%" display="flex" flexDirection="column" justifyContent="space-between">
        {swipeUser.id != "" &&
        <Box>
            <Box display="flex" justifyContent="flex_start" flexDirection="column" maxHeight="70%">
                <Box marginBottom="1%" alignSelf="center" fontSize="x-large">{swipeUser.username}: {swipeUser.gender}</Box>
                <Image minBlockSize="150px" maxBlockSize="1000px" borderRadius="full" display="self" alignSelf="center" marginBottom="2%" src={swipeUser.photos[0].htmlSrcImg} alt="pouet"/>
                <Box display="flex" justifyContent="space-evenly" flexDirection="row">
                    <Button value={swipeList[index]} onClick={likeHandler}>YES</Button>
                    <Button value={swipeList[index]} onClick={dislikeHandler}>NO</Button>
                </Box>
            </Box>
        </Box>}
    </Box>);
}

export default Swipe;
