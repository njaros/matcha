import { Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack } from "@chakra-ui/react";
import { useState } from "react";

export function DistanceSlide(props: {setDistanceMax: (newVal: number) => void, defaultValue: number})
{
    const [sliderValue, setSliderValue] = useState<number>(props.defaultValue);

    return (
        <Slider
            display="flex"
            id="distanceMaxSlideFilter"
            min={0}
            max={100}
            defaultValue={props.defaultValue}
            onChange={(val) => {
                setSliderValue(val);
                props.setDistanceMax(val);
            }}
        >
            <SliderMark value={20}>20km</SliderMark>
            <SliderMark value={40}>40km</SliderMark>
            <SliderMark value={60}>60km</SliderMark>
            <SliderMark value={80}>80km</SliderMark>
            <SliderMark
                value={sliderValue}
                mt="-7"
                ml="-5"
            >
                {sliderValue}km
            </SliderMark>
            <SliderTrack>
                <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
        </Slider>
    )
}