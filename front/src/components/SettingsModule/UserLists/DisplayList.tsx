import { IListUser } from "../../../Interfaces";
import { Flex, Image, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import ReturnButton from "../ReturnButton";

const lineSizes={base: "70px", sm: "95px", md: "115px", lg:"135px", xl: "160px"}

export default function DisplayList(props: {list: IListUser[], enableDate: boolean}) {
    return (
    <Flex flex={1} overflow={"hidden"} flexDirection={"column"} w="80%" alignItems={"center"} justifyContent={"flex-end"}>
        <Flex w="100%" overflowY="auto" flexDirection="column" flex={1} justifyContent={"flex-start"}>
            {props.list.map(user => {
                return (
                    <NavLink key={user.id} to={`/other_profile/${user.id}`}>
                        <Flex display="flex" alignItems={"center"} h={lineSizes} flexDir={"row"} justifyContent={"flex-start"}>
                            <Image
                                    fit="contain"
                                    src={user.photo}/>
                            <Text   margin="0 5%"
                                    >{user.username}</Text>
                            {props.enableDate && <Text>{user.at}</Text>}
                        </Flex>
                    </NavLink>
                )
            })}
        </Flex>
        <ReturnButton to="/settings/"/>
    </Flex>
    )
}