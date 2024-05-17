import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Icon, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Axios from "../../../tools/Caller";
import { FaArrowDown } from "react-icons/fa";

const spacingBoxes = {base: 1, sm: 2, md: 2, lg: 3, xl: 4}
const blockSizes = { base: '100px', sm: '140px', md: '170px', lg: '200px', xl: '250px' }
const TagsFontSize = { base: '15px', sm: '18px', md: '21px', lg: '25px', xl: '30px' };
const marginSize = { base: '22px', sm: '25px', md: '30px', lg: '35px', xl: '40px' };

export default function TagsSelector(props:
    {
        setTags: (newList: number[]) => void,
        defaultValue: number[]
    })
{
    const [ hobbies, setHobbies ] = useState<{id: number, name: string, selected: boolean}[]>([]);
    const [ rerenderer, setRerenderer] = useState<boolean>(true);

    useEffect(() => 
    {
        get_hobbies();
    }, [])

    function get_hobbies() {
        Axios.get("profile/get_hobbies")
        .then(response => {
            setHobbies(response.data.map(
                (hobby: {id: number, name: string}) => ({
                ...hobby,
                selected: props.defaultValue.includes(hobby.id)
            })));
        })
        .catch(err => {
            console.warn(err);
        })
    }

    function forceRerender() {
        setRerenderer(!rerenderer);
    }

    function handleClickOn(e: any) {
        let hobbiesModifed = hobbies;
        let tags: number[] = [];
        hobbiesModifed.forEach((elt) => {
            if (elt.id == e.target.value)
                elt.selected = true;
            if (elt.selected)
                tags.push(elt.id);
        });
        setHobbies(hobbiesModifed);
        props.setTags(tags);
        forceRerender();
    }

    function handleClickOff(e: any) {
        let hobbiesModifed = hobbies;
        let tags: number[] = [];
        hobbiesModifed.forEach((elt) => {
            if (elt.id == e.target.value)
                elt.selected = false;
            if (elt.selected)
                tags.push(elt.id);
        });
        setHobbies(hobbiesModifed);
        props.setTags(tags);
        forceRerender();
    }

    const Hobbies_Boxes = () => {
        return hobbies.map((elt) => {
            return(
                    <Button 
                            className={"tagButton_" + elt.id}
                            key={elt.id}
                            fontSize={TagsFontSize}
                            colorScheme={elt.selected? "matchaPink": "gray"}
                            boxShadow="base"
                            value={elt.id}
                            onClick={elt.selected? handleClickOff: handleClickOn}>
                        {elt.name}
                    </Button>
                )
        })
    }

    return (
        <Accordion borderRadius="15px" backgroundColor="pink.400" borderColor="pink.300" allowMultiple marginTop={marginSize}>
            <AccordionItem>
                <AccordionButton color="pink.100" textAlign="center">
                    <Box fontSize={TagsFontSize} fontWeight="bold" flex="1" as="span">
                            Select mandatory hobbies
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                    {hobbies.length != 0 && <SimpleGrid minChildWidth={blockSizes} spacing={spacingBoxes}>
                        <Hobbies_Boxes />
                    </SimpleGrid>}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}