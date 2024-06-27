import { Box, Flex, Text } from "@chakra-ui/react";
import { storeFilter } from "../../../tools/Stores";
import { DateTools } from "../../../tools/DateTools";
import { AgeRangeSlider } from "./AgeRangeSlider";
import { DistanceSlide } from "./DistanceSlide";
import { FameGapSlide } from "./FameGapSlide";
import TagsSelector from "./TagsSelector";
import Geoloc from "./Geoloc";
import ReturnButton from "../ReturnButton";

export default function Filter(props: {focus: boolean}) {
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
        <Flex  
            flex={1} 
            flexDirection={"column"} 
            alignItems={"center"} 
            justifyContent={"flex-end"}
            overflow={'hidden'}
        >
            <Flex 
                flexDirection={'row'}
                paddingLeft={'20px'}
                marginTop={'10px'}
                marginBottom={'10px'}
                placeSelf={'flex-start'}
            >
                <Box alignSelf={'center'}>
                    <ReturnButton to={-1}/>
                </Box>
                <Text
                    fontSize={'xx-large'}
                    alignSelf={'center'}
                    margin={'0px 5px'}
                    fontWeight={'bold'}
                    paddingLeft={'5px'}
                >
                    Filter
                </Text>
            </Flex>
            <Flex   
                flex={1}
                overflowY={'auto'}
                marginTop="10px"
                width="80%"
                flexDirection="column" 
                alignItems="center"
            >
                <Geoloc focus={props.focus}/>
                <Box 
                    padding={'15px'} 
                    width={"100%"} 
                    borderRadius={'15px'} 
                    backgroundColor={'#edf2f7'}
                >
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
                </Box>
                <TagsSelector
                    setTags={handlerTags}
                    defaultValue={filter.hobby_ids}
                    />
            </Flex>
        </Flex>
    )
}