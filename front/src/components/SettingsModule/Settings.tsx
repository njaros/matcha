import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Profile from "./Profile";
import Photo from "./Photo";
import Geoloc from "./FilterModule/Geoloc";
import { useState } from "react";
import Hobbies from "./Hobbies";
import Filter from "./FilterModule/Filter";

const settingFontSize = { base: '16px', sm: '18px', md: '20px', lg: '22px', xl: '24px' };

const Settings = () => {
    const [ geoLocFocus, setGeoLocFocus ] = useState<boolean>(false);

    const handleChange = (index: number) => {
        if (index == 3)
            setGeoLocFocus(true);
        else
            setGeoLocFocus(false);
    }

    return (
        <Tabs
            overflow="auto"
            h="100%"
            display="flex"
            flexDirection="column"
            width={{base: "90%", sm: "90%", md: "90%", lg: "80%", xl: "80%"}}
            isFitted
            onChange={(index) => handleChange(index)} 
            defaultIndex={0}>
                <TabList display="flex" width="100%">
                    <Tab flex="1" fontSize={settingFontSize} textAlign="center">Profile</Tab>
                    <Tab flex="1" fontSize={settingFontSize} textAlign="center">Photos</Tab>
                    <Tab flex="1" fontSize={settingFontSize} textAlign="center">Hobbies</Tab>
                    <Tab flex="1" fontSize={settingFontSize} textAlign="center">Filters</Tab>
                </TabList>
            <TabPanels>
                <TabPanel>
                    <Profile />
                </TabPanel>
                <TabPanel>
                    <Photo />
                </TabPanel>
                <TabPanel>
                    <Hobbies />
                </TabPanel>
                <TabPanel>
                    <Filter focus={geoLocFocus}/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default Settings;