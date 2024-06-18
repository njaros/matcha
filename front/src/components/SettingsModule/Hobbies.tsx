import { useEffect, useState } from "react"
import Axios from "../../tools/Caller";
import { Box, Tag, SimpleGrid, Button } from "@chakra-ui/react"
import ReturnButton from "./ReturnButton";

const Hobbies = () => {
    const [ hobbies, setHobbies ] = useState<{id: number, name: string, belong: boolean}[]>([]);
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
        return hobbies.map((elt) => {
            return(
                    <Button key={elt.id}
                            colorScheme={elt.belong? "purple_palet": "gray"}
                            margin={'1%'}
                            padding={'7px 12px'}
                            borderRadius={'full'}
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
        <Box 
            flex={1} 
            display="flex"
            flexDirection="column" 
            bg="white" 
            padding="10%" 
            borderRadius="5%"
        >
            <Box 
                marginBottom = "10%" 
                fontSize="xx-large"
                fontWeight={'bold'}
            >
                Your Hobbies 
            </Box>
            {hobbies.length != 0 && 
                <Box    
                    display={"flex"}
                    flexWrap={"wrap"}
                    flexDirection={"row"}>
                    <Hobbies_Boxes />
            </Box>}
        </Box>
    )
}

export default Hobbies