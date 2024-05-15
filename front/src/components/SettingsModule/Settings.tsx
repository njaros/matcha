import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Profile from "./Profile";
import Photo from "./Photo";
import Geoloc from "./Geoloc";
import { useState } from "react";
import Hobbies from "./Hobbies";
import Filter from "./FilterModule/Filter";

const Settings = () => {
    const [ geoLocFocus, setGeoLocFocus ] = useState<boolean>(false);

    const handleChange = (index: number) => {
        if (index == 4)
            setGeoLocFocus(true);
        else
            setGeoLocFocus(false);
    }

    return (
        <Tabs isFitted onChange={(index) => handleChange(index)} defaultIndex={0}>
            <TabList>
                <Tab>Profile</Tab>
                <Tab>Photos</Tab>
                <Tab>Hobbies</Tab>
                <Tab>Filters</Tab>
                <Tab>Geoloc</Tab>
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
                    <Filter />
                </TabPanel>
                <TabPanel>
                    <Geoloc focus={geoLocFocus}/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default Settings;