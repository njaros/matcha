import { IListUser } from "../../../Interfaces";
import { Box, Divider, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import ReturnButton from "../ReturnButton";
import { DateTools } from "../../../tools/DateTools";

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
        {props.list.length === 0 ?
            <Box
                flex={1}
                w="100%"
                bgImage="../../assets/images/main-tenant-numero-0.png"
                backgroundSize="contain" bgPosition="center" bgRepeat="no-repeat"
            />
        :
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
                            <NavLink key={index} to={`/other_profile/${user.id}`}>
                                <Flex flexDirection={"column"} w="170px">
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
                                        marginTop={'5px'}
                                        >
                                        <Text w="50%" fontWeight={'bold'} overflow={'hidden'} whiteSpace={'nowrap'} textOverflow="ellipsis" >{user.username}</Text>
                                        <Text placeSelf={"flex-end"} fontWeight={'bold'}>{DateTools.timeAgo(user.at)} ago</Text>
                                    </Flex>
                                </Flex>
                            </NavLink>
                        )
                    })}
            </SimpleGrid>
        }
    </Flex>
    )
}