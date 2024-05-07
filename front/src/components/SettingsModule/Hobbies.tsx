import { useEffect, useState } from "react"
import Axios from "../../tools/Caller";
import { Box, Tag, SimpleGrid, Button } from "@chakra-ui/react"
import { inherits } from "util";

const Hobbies = () => {
    const [ hobbies, setHobbies ] = useState<{id: number, name: string, belong: boolean}[] | null>(null);
    const [ rerenderPls, setRerenderPls ] = useState<boolean>(false);

    function get_hobbies() {
        Axios.get("profile/get_self_hobbies")
        .then(response => {
            console.log(response);
            setHobbies(response.data);
        })
        .catch(err => {
            console.warn(err);
        })
    }

    const handleClickOn = (e: any) => {
        Axios.post("profile/add_hobby", {"id": e.target.value})
        .then(() => {
            const newTab = hobbies;
            newTab?.forEach((elt) => {
                if (elt.id == e.target.value)
                    elt.belong = true;
            })
            setHobbies(newTab);
            setRerenderPls(!rerenderPls)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleClickOff = (e: any) => {
        Axios.post("profile/del_hobby", {"id": e.target.value})
        .then(() => {
            const newTab = hobbies;
            newTab?.forEach((elt) => {
                if (elt.id == e.target.value)
                    elt.belong = false;
            })
            setHobbies(newTab);
            setRerenderPls(!rerenderPls)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const Hobbies_Boxes = () => {
        return hobbies?.map((elt) => {
            return(
                    <Button colorScheme={elt.belong? "matchaPink": "gray"}
                            boxShadow="base"
                            value={elt.id}
                            onClick={elt.belong? handleClickOff: handleClickOn}>
                        {elt.name}
                    </Button>
                ) 
            
        })
    }

    useEffect(() => {
        get_hobbies()
    }, [])

    return (
        <Box display="flex" flexDirection="column" bg="white" boxShadow="base" padding="10%" borderRadius="5%">
            <Box alignSelf="center" marginBottom = "15%" fontFamily="fantasy" fontSize="lg">
                Select your Hobbies !
            </Box>
            {hobbies && <SimpleGrid minChildWidth="100px" spacing={10}>
                <Hobbies_Boxes />
            </SimpleGrid>}
        </Box>
    )
}

export default Hobbies