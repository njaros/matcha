import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Profile from "./Profile";
import Photo from "./Photo";

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
                    vvv
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default Settings;