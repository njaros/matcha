import { Box, Divider, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Profile from "./Profile";
import Photo from "./Photo";
import Geoloc from "./FilterModule/Geoloc";
import { useState } from "react";
import Hobbies from "./Hobbies";
import Filter from "./FilterModule/Filter";
import { NavLink } from "react-router-dom";

const settingFontSize = { base: '16px', sm: '18px', md: '20px', lg: '22px', xl: '24px' };

const Settings = () => {

    function NavLinkSettings(props: {path: string, name: string}) {
        return (
        <Flex   w="100%" fontSize={"18px"} justifyContent={"center"} margin="4% 0">
            <NavLink    to={props.path}>
                <Text>{props.name}</Text>
            </NavLink>
        </Flex>
        )
    }

    return (
        <Box flex={1} margin="15px 0" display={"flex"} flexDirection={"column"} w={"80%"} justifyContent={"flex-start"}>  
            <Flex   bgColor={"#f2f2f2"}
                    flexDirection={"column"}
                    justifyContent={"space-evenly"}
                    alignItems={"center"}
                    borderRadius="20px">
                <NavLinkSettings path={"/settings/profile"} name={"profile"}/>
                <Divider w="70%" borderColor="#a659ec" borderWidth="2px" borderRadius="2px" />
                <NavLinkSettings path={"/settings/hobbies"} name={"hobbies"}/>
                <Divider w="70%" borderColor="#a659ec" borderWidth="2px" borderRadius="2px" />
                <NavLinkSettings path={"/settings/photos"} name={"photos"}/>
            </Flex>
            <Divider margin={"15px 0"} alignSelf={"center"} w="85%" borderColor="#212328" borderWidth="2px" borderRadius="2px" />
            <Flex   bgColor={"#f2f2f2"}
                    flexDirection={"column"}
                    justifyContent={"space-evenly"}
                    alignItems={"center"}
                    borderRadius="20px">
                <NavLinkSettings path={"/settings/filter"} name={"filter"}/>
            </Flex>
            <Divider margin={"15px 0"} alignSelf={"center"} w="85%" borderColor="#212328" borderWidth="2px" borderRadius="2px" />
            <Flex   bgColor={"#f2f2f2"}
                    flexDirection={"column"}
                    justifyContent={"space-evenly"}
                    alignItems={"center"}
                    borderRadius="20px">
                <NavLinkSettings path={"/settings/liked_list"} name={"likes"}/>
                <Divider w="70%" borderColor="#a659ec" borderWidth="2px" borderRadius="2px" />
                <NavLinkSettings path={"/settings/match_list"} name={"matches"}/>
                <Divider w="70%" borderColor="#a659ec" borderWidth="2px" borderRadius="2px" />
                <NavLinkSettings path={"/settings/visits_list"} name={"visitors"}/>
            </Flex>
        </Box>
    )
}

export default Settings;