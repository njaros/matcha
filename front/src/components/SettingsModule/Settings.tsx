import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
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
        <NavLink to={props.path} style={{display: "flex"}}>
            <Text>{props.name}</Text>
        </NavLink>
        )
    }

    return (
        <Box flex={1}>
            <NavLinkSettings path={"/settings/profile"} name={"profile"}/>
            <NavLinkSettings path={"/settings/photos"} name={"photos"}/>
            <NavLinkSettings path={"/settings/filter"} name={"filter"}/>
            <NavLinkSettings path={"/settings/hobbies"} name={"hobbies"}/>
        </Box>
    )
}

export default Settings;