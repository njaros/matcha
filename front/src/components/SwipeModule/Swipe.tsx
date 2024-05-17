import { useEffect, useRef, useState } from "react";
import { ISwipeUser, ISwipeFilter } from "../../Interfaces";
import Axios from "../../tools/Caller";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { storeFilter } from "../../tools/Stores";

const Swipe = () => {
    const [ swipeList, setSwipeList ] = useState<ISwipeUser[]>([]);
    const [ index, setIndex ] = useState<number>(0);
    const { filter, updateFilter } = storeFilter()

    function get_ten() {
        console.log(filter);
        Axios.post("/swipe/get_ten_with_filters", filter).then(
            response => {
                console.log(response.data);
                const newList: ISwipeUser[] = [];
                response.data.map((elt: any) => {
                    newList.push({
                        ...elt,
                        photo: elt.binaries != null ? "data:".concat(elt.mimetype)
                        .concat(";base64,")
                        .concat(elt.binaries) : "default-avatar.png"})
                })
                setSwipeList(newList);
            }
        ).catch(
            err => {
                console.log(err);
            }
        )
    }

    function get_ten_randoms() {
        Axios.get("swipe/get_ten_randoms").then(
            response => {
                console.log(response.data);
                const newSwipeList: ISwipeUser[] = [];
                response.data.forEach((elt: any) => {
                    const swipeElt: ISwipeUser = {
                        ...elt,
                        photo: elt.binaries != null ? "data:".concat(elt.mimetype)
                        .concat(";base64,")
                        .concat(elt.binaries) : "default-avatar.png"
                    }
                    newSwipeList.push(swipeElt);
                })
                setSwipeList(newSwipeList);
            }
        ).catch(
            error => {
                console.log(error);
                setSwipeList([]);
            }
        ).finally(() =>
            setIndex(0)
        )
    }

    useEffect(() => {
        get_ten();
    }, [])

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
            get_ten_randoms();
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
            get_ten_randoms();
        }
        else
        {
            setIndex(idx => idx + 1);
        }
    }

    return (
    <Box flexGrow={1} className="Swipe" height="100%" display="flex" flexDirection="column" justifyContent="space-between">
        {swipeList.length > 0 &&
        <Box display="flex" justifyContent="flex_start" flexDirection="column" maxHeight="70%">
            <Box marginBottom="1%" alignSelf="center" fontSize="x-large">{swipeList[index].username}: {swipeList[index].gender}</Box>
            <Image minBlockSize="150px" maxBlockSize="1000px" borderRadius="full" display="self" alignSelf="center" marginBottom="2%" src={swipeList[index].photo} alt="pouet"/>
            <Box display="flex" justifyContent="space-evenly" flexDirection="row">
                <Button value={swipeList[index].id} onClick={likeHandler}>YES</Button>
                <Button value={swipeList[index].id} onClick={dislikeHandler}>NO</Button>
            </Box>
        </Box>}
    </Box>);
}

export default Swipe;
