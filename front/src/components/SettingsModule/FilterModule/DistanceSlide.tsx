import { Box, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack } from "@chakra-ui/react";
import { useState } from "react";

const SliderFontSize = { base: '12px', sm: '14px', md: '16px', lg: '20px', xl: '24px' };
const CommentaryFontSize = { base: '15px', sm: '18px', md: '21px', lg: '25px', xl: '30px' };
const marginSize = { base: '8px 0px', sm: '11px 0px', md: '14px 0px', lg: '17px 0px', xl: '21px 0px' };

export function DistanceSlide(props: {setDistanceMax: (newVal: number) => void, defaultValue: number})
{
    const [sliderValue, setSliderValue] = useState<number>(props.defaultValue);

    return (
        <Box margin={marginSize} fontSize={SliderFontSize} display="flex" flexDirection="column">
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                fontWeight="bold"
                margin={marginSize}
                fontSize={CommentaryFontSize}
                >
                <Box>
                    Distance max
                </Box>
                <Box>
                    {sliderValue} km
                </Box>
            </Box>
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
                <SliderTrack backgroundColor="#edf2f7">
                    <SliderFilledTrack backgroundColor="#A659EC"/>
                </SliderTrack>
                <SliderThumb boxSize="10px" outline="solid 2px #A659EC" />
            </Slider>
        </Box>
    )
}