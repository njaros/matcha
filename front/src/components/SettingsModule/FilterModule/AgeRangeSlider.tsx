import { RangeSlider, RangeSliderMark, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, Box } from "@chakra-ui/react";
import { useState } from "react";

const SliderFontSize = { base: '12px', sm: '14px', md: '16px', lg: '20px', xl: '24px' };
const CommentaryFontSize = { base: '15px', sm: '18px', md: '21px', lg: '25px', xl: '30px' };
const marginSize = { base: '8px', sm: '11px', md: '14px', lg: '17px', xl: '21px' };

export function AgeRangeSlider(props: {
    setAgeRange: (newVal: [number, number]) => void,
    defaultValue: [number, number]
})
{
    const [sliderValue, setSliderValue] = useState<[number, number]>(props.defaultValue);

    return (
        <Box margin={marginSize} fontSize={SliderFontSize} display="flex" flexDirection="column">
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                fontWeight="bold"
                margin={marginSize}
                fontSize={CommentaryFontSize}
                color="pink.200">
                <Box>
                    Age Range
                </Box>
                <Box>
                    {sliderValue[0]} - {sliderValue[1]}
                </Box>
            </Box>
            <RangeSlider
                colorScheme="matchaPink"
                display="flex"
                minHeight="20%"
                id="distanceMaxSlideFilter"
                min={18}
                max={150}
                defaultValue={props.defaultValue}
                onChange={(val) => {
                    setSliderValue([val[0], val[1]]);
                    props.setAgeRange([val[0], val[1]]);
                }}
                >
                <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
            </RangeSlider>
        </Box>
    )
}
