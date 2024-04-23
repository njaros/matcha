import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Profile from "./Profile";
import Photo from "./Photo";
import Geoloc from "./Geoloc";

const Settings = () => {
    return (
        <Tabs isFitted>
            <TabList>
                <Tab>Profile</Tab>
                <Tab>Photos</Tab>
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
                    <Geoloc />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default Settings;