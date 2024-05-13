import { useEffect, useRef, useState } from "react";
import { ISwipeUser, ISwipeFilter } from "../../Interfaces";
import Axios from "../../tools/Caller";
import { Box, Button, Image, Slider, SliderMark, Text } from "@chakra-ui/react";
import { DistanceSlide } from "./DistanceSlide";
import { DateTools } from "../../tools/DateTools";
import { AgeRangeSlider } from "./AgeRangeSlider";

const Swipe = () => {
    const [ swipeList, setSwipeList ] = useState<ISwipeUser[]>([]);
    const [ index, setIndex ] = useState<number>(0);
    const [ filter, setFilter ] = useState<ISwipeFilter>({
        date_min: DateTools.dateFromAge(18),
        date_max: DateTools.dateFromAge(150),
        distance_max: 20,
        hobby_ids: [],
        ranking_gap: 2
    })

    function get_ten_randoms() {
        Axios.get("swipe/get_ten_randoms").then(
            response => {
                console.log(response.data);
                const newSwipeList: ISwipeUser[] = [];
                response.data.forEach(elt => {
                    const swipeElt: ISwipeUser = {
                        id: elt.id,
                        username: elt.username,
                        birthdate: elt.birthdate,
                        gender: elt.gender,
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
        get_ten_randoms();
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

    //FILTER HANDLERS

    function handleDistanceMax(val: number) {
        let newFilter = filter;
        filter.distance_max = val;
        setFilter(newFilter);
    }

    function handlerAgeMinMax(val: [number, number]) {
        let newFilter = filter;
        filter.date_min = DateTools.dateFromAge(val[0]);
        filter.date_max = DateTools.dateFromAge(val[1]);
        setFilter(newFilter);
    }

    return (
    <Box display="flex" flexDirection="column" justifyContent="center">
        <Box display="flex" flexDirection="column">
            <Text marginBottom="3%">Set your filters</Text>
            <Box display="flex" flexDirection="row" justifyContent="space-around">
                <DistanceSlide setDistanceMax={handleDistanceMax} defaultValue={20}/>
                <AgeRangeSlider setAgeRange={handlerAgeMinMax} defaultValue={[20, 40]}/>
            </Box>
        </Box>
        {swipeList.length > 0 &&
        <Box display="flex" justifyContent="center" flexDirection="column">
            <Box marginBottom="1%" alignSelf="center" fontSize="x-large">{swipeList[index].username}: {swipeList[index].gender}</Box>
            <Image display="self" alignSelf="center" marginBottom="2%" src={swipeList[index].photo} height="40%" width="40%" alt="pouet"/>
            <Box display="flex" justifyContent="space-evenly" flexDirection="row">
                <Button value={swipeList[index].id} onClick={likeHandler}>YES</Button>
                <Button value={swipeList[index].id} onClick={dislikeHandler}>NO</Button>
            </Box>
        </Box>}
    </Box>);
}

export default Swipe;