import { Box } from "@chakra-ui/react";
import { storeFilter } from "../../../tools/Stores";
import { DateTools } from "../../../tools/DateTools";
import { AgeRangeSlider } from "./AgeRangeSlider";
import { DistanceSlide } from "./DistanceSlide";
import { FameGapSlide } from "./FameGapSlide";
import TagsSelector from "./TagsSelector";

export default function Filter() {
    const { filter, updateFilter } = storeFilter();

    function handleDistanceMax(val: number) {
        let newFilter = filter;
        filter.distance_max = val;
        updateFilter(newFilter);
    }

    function handleGapMax(val: number) {
        let newFilter = filter;
        filter.ranking_gap = val;
        updateFilter(newFilter);
    }

    function handlerAgeMinMax(val: [number, number]) {
        let newFilter = filter;
        filter.date_max = DateTools.dateFromAge(val[0]);
        filter.date_min = DateTools.dateFromAge(val[1]);
        updateFilter(newFilter);
    }

    function handlerTags(tags: number[]) {
        let newFilter = filter;
        filter.hobby_ids = tags;
        updateFilter(newFilter);
    }

    return (
        <Box>
            <AgeRangeSlider
                setAgeRange={handlerAgeMinMax}
                defaultValue={
                    [
                        DateTools.ageFromDate(filter.date_max),
                        DateTools.ageFromDate(filter.date_min)
                    ]
                } />
            <DistanceSlide
                setDistanceMax={handleDistanceMax}
                defaultValue={filter.distance_max}
                />
            <FameGapSlide
                setGapMax={handleGapMax}
                defaultValue={filter.ranking_gap}
                />
            <TagsSelector
                setTags={handlerTags}
                defaultValue={filter.hobby_ids}
                 />
        </Box>
    )
}