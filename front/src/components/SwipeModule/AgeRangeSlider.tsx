import { RangeSlider, RangeSliderMark, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack } from "@chakra-ui/react";
import { useState } from "react";

export function AgeRangeSlider(props: {
    setAgeRange: (newVal: [number, number]) => void,
    defaultValue: [number, number]
})
{
    const [sliderValue, setSliderValue] = useState<[number, number]>(props.defaultValue);

    return (
        <RangeSlider
            id="distanceMaxSlideFilter"
            min={18}
            max={150}
            defaultValue={props.defaultValue}
            onChange={(val) => {
                setSliderValue([val[0], val[1]]);
                props.setAgeRange([val[0], val[1]]);
            }}
        >
            <RangeSliderMark value={20}>20</RangeSliderMark>
            <RangeSliderMark value={30}>30</RangeSliderMark>
            <RangeSliderMark value={50}>60</RangeSliderMark>
            <RangeSliderMark value={80}>80</RangeSliderMark>
            <RangeSliderMark
                value={sliderValue[0]}
                mt="-10"
                ml="-5"
            >
                {sliderValue[0]}
            </RangeSliderMark>
            <RangeSliderMark
                value={sliderValue[1]}
                mt="-10"
                ml="-5"
            >
                {sliderValue[1]}
            </RangeSliderMark>
            <RangeSliderTrack>
                <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
        </RangeSlider>
    )
}
