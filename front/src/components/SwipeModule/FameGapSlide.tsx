import { Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack } from "@chakra-ui/react";
import { useState } from "react";

export function FameGapSlide(props: {setGapMax: (newVal: number) => void, defaultValue: number})
{
    const [sliderValue, setSliderValue] = useState<number>(props.defaultValue);

    return (
        <Slider
            display="flex"
            id="distanceMaxSlideFilter"
            min={0}
            max={10}
            defaultValue={props.defaultValue}
            onChange={(val) => {
                setSliderValue(val);
                props.setGapMax(val);
            }}
        >
            <SliderMark value={0}>0</SliderMark>
            <SliderMark value={10}>10</SliderMark>
            <SliderMark
                value={sliderValue}
                mt="-7"
                ml="-5"
            >
                {sliderValue}
            </SliderMark>
            <SliderTrack>
                <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
        </Slider>
    )
}