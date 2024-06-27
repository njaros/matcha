import { IListUser } from "../../../Interfaces";
import { Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import ReturnButton from "../ReturnButton";

const lineSizes={base: "70px", sm: "95px", md: "115px", lg:"135px", xl: "160px"}

export default function DisplayList(props: {list: IListUser[], enableDate: boolean, name: string}) {

    return (
    <Flex flex={1} overflow={"hidden"} flexDirection={"column"} w="100%" h="100%" alignItems={"center"} justifyContent={"flex-end"}>
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
                        /> :
        <Flex w="100%" marginBottom={"3%"} overflowY="auto" flexDirection="column" flex={1} justifyContent={"flex-start"}>
            {props.list.map((user, idx, array) => {
                return (
                    <Flex key={idx} w="100%" direction="column">
                        <NavLink to={`/other_profile/${user.id}`}>
                            <Flex display="flex" h={lineSizes} flexDir={"row"} justifyContent={"flex-start"}>
                                <Image
                                        fit="contain"
                                        borderRadius={"full"}
                                        src={user.photo}/>
                                <Text   margin="0 5%"
                                        alignSelf={"center"}
                                        >{user.username}</Text>
                                {props.enableDate && <Text  alignSelf={"center"}>{user.at}</Text>}
                        </Flex>
                    </NavLink>
                    {idx < array.length -1 && <Divider  
                                                        placeSelf={"center"}
                                                        w="80%"
                                                        borderWidth={"2px"}
                                                        borderRadius={"2px"}
                                                        borderColor="black"
                                                        margin={("3% 0")}/>}
                    </Flex>
                )
            })}
        </Flex>}
       
    </Flex>
    )
}