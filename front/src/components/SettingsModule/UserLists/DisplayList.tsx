import { IListUser } from "../../../Interfaces";
import { Box, Divider, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import ReturnButton from "../ReturnButton";

const lineSizes={base: "70px", sm: "95px", md: "115px", lg:"135px", xl: "160px"}

export default function DisplayList(props: {list: IListUser[], enableDate: boolean, name: string}) {
    
    return (
    <Flex 
        flex={1} 
        overflow={"hidden"} 
        flexDirection={"column"} 
        w="100%" 
        // alignItems={"center"} 
    >
        <Flex 
            flexDirection={'row'}
            placeSelf={'self-start'}
            paddingLeft={'15px'}
            marginTop={'15px'}
        >
            <Box 
                alignSelf={'center'}
            >
                <ReturnButton to="/settings/"/>
            </Box>
             <Text
                fontSize={'xx-large'}
                alignSelf={'center'}
                margin={'0px 5px'}
                fontWeight={'bold'}
                paddingLeft={'5px'}
            >
                {props.name}
            </Text>
        </Flex>
        {props.list.length === 0 && 
                        <Image
                            src="../../assets/images/main-tenant-numero-0.png"
                            objectFit="contain"
                            backgroundPosition="top"
                            backgroundRepeat="no-repeat"
                            margin={'auto'}
                            width={{ base: "95%", sm: "80%", md: "60%", lg: "50%", xl: "40%"}}
                            height="auto" 
                    ></Image>
        }
        <SimpleGrid
            columns={{ base: 2, md: 3, lg: 4, xl: 5 }}
            spacing={3}
            w="100%"
            h="100%"
            justifyItems="center"
            overflowY={'auto'}
            marginTop={'15px'}
            padding={'0px 10px'}  
        >
            {props.list.map((user, index) => {
                return (
                    <Flex
                        key = {index} 
                        flexDirection={'column'}
                    >
                        <NavLink key={user.id} to={`/other_profile/${user.id}`}>
                        <Box 
                            bg="#edf2f7" 
                            h="300px" 
                            w="170px" 
                            borderRadius={'15px'} 
                            border={'1px'} 
                            borderColor={'grey'}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <Image 
                                src={user.photo} 
                                alt="Photo" 
                                objectFit="cover" 
                                borderRadius="15px"
                                top="0"
                                left="0"
                                width="100%"
                                height="100%" 
                        />
                        </Box>
                        <Flex
                            justifyContent={'center'}
                            marginTop={'5px'}
                        >
                            <Text fontWeight={'bold'}>{user.username}</Text>
                        </Flex>
                        </NavLink>
                    </Flex>
                )
            })}
        </SimpleGrid>
    </Flex>
    )
}