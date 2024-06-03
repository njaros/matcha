import { Box, Flex, Text } from "@chakra-ui/react"
import { storeConvBool } from "../../tools/Stores"

function MatchList(){

    const convBool = storeConvBool(state => state.convBool)

    return (<>
        <Flex 
            justifyContent="center" 
            alignItems="center"
            paddingTop={'10px'}
            h={'25%'}
        >
            <Flex
                borderRadius={'5px'}
                bg={'green'}
                w={'95%'}
                h={'100%'} 
                hidden={convBool}
                // justifyContent={'center'}  
            >
                <Text>Matches with you !</Text>

            </Flex>
        </Flex>
    </>)
}

export default MatchList