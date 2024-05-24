import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Tag, Box, Button, Icon, SimpleGrid, Text, Divider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Axios from "../../../tools/Caller";
import { FaArrowDown } from "react-icons/fa";

const spacingBoxes = { base: 1, sm: 2, md: 2, lg: 3, xl: 4 }
const blockSizes = { base: '100px', sm: '140px', md: '170px', lg: '200px', xl: '250px' }
const TagsFontSize = { base: '15px', sm: '18px', md: '21px', lg: '25px', xl: '30px' };
const marginSize = { base: '22px', sm: '25px', md: '30px', lg: '35px', xl: '40px' };

export default function TagsSelector(props: any) {
    const { setTags, defaultValue } = props;
    const [ hobbies, setHobbies ] = useState<{id: number, name: string, selected: boolean}[]>([]);

    useEffect(() => {
        getHobbies();
    }, []);

    const getHobbies = async () => {
        try {
            const response = await Axios.get("profile/get_hobbies");
            const hobbiesWithSelection = response.data.map((hobby: any) => ({
                ...hobby,
                selected: defaultValue.includes(hobby.id)
            }));
            setHobbies(hobbiesWithSelection);
        } catch (err) {
            console.warn(err);
        }
    };

    const handleClick = (id: any) => {
        const updatedHobbies = hobbies.map((hobby) =>
            hobby.id === id ? { ...hobby, selected: !hobby.selected } : hobby
        );
        setHobbies(updatedHobbies);
        const selectedTags = updatedHobbies.filter(hobby => hobby.selected).map(hobby => hobby.id);
        setTags(selectedTags);
    };
    console.log(hobbies.filter(hobby => hobby.selected))
    return (
        <>
            <Text fontWeight="bold" marginTop="30px">
                Select your hobbies
            </Text>
            <Box display="flex" justifyContent="flex-start" flexDirection="column" margin="5% 0">
                <Box display="flex" flexDirection="row" flexWrap="wrap">
                    {hobbies.map((hobby) => (
                        <Box
                            key={hobby.id}
                            padding={'7px 12px'}
                            fontWeight={'bold'}
                            onClick={() => handleClick(hobby.id)}
                            margin="1%"
                            borderRadius="20px"
                            color={hobby.selected ? "white" : "black"}
                            bgColor={hobby.selected ? "#A659EC" : "#f2f2f2"}
                            transition="background-color 0.2s ease-in-out, color 0.2s ease-in-out"
                        >
                            {hobby.name}
                        </Box>
                    ))}
                </Box>
            </Box>
        </>
    );
}
