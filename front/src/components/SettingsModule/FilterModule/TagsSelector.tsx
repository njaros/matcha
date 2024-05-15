import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Button, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Axios from "../../../tools/Caller";

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
                    <Button key={elt.id}
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
        <Accordion allowMultiple overflowY="auto" maxHeight="70%">
            <AccordionItem>
                <AccordionButton>
                </AccordionButton>
                <AccordionPanel>
                    {hobbies.length != 0 && <SimpleGrid minChildWidth="100px" spacing={3}>
                        <Hobbies_Boxes />
                    </SimpleGrid>}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}