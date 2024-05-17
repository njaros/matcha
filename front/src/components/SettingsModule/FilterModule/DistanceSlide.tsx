import { Box, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack } from "@chakra-ui/react";
import { useState } from "react";

const SliderFontSize = { base: '12px', sm: '14px', md: '16px', lg: '20px', xl: '24px' };
const CommentaryFontSize = { base: '15px', sm: '18px', md: '21px', lg: '25px', xl: '30px' };
const marginSize = { base: '8px', sm: '11px', md: '14px', lg: '17px', xl: '21px' };

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
                color="pink.100">
                <Box>
                    distance max
                </Box>
                <Box>
                    {sliderValue} km
                </Box>
            </Box>
            <Slider
                colorScheme="matchaPink"
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
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </Box>
    )
}