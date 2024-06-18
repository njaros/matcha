import { Box, Divider, Flex, Icon, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Profile from "./Profile";
import Photo from "./Photo";
import Geoloc from "./FilterModule/Geoloc";
import { useState } from "react";
import Hobbies from "./Hobbies";
import Filter from "./FilterModule/Filter";
import { NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdAddAPhoto } from "react-icons/md";
import { TbFilter } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { FaHeartPulse } from "react-icons/fa6";
import { RiSpyFill } from "react-icons/ri";

const settingFontSize = { base: '16px', sm: '18px', md: '20px', lg: '22px', xl: '24px' };

const Settings = () => {

    function NavLinkSettings(props: {path: string, name: string}) {
        return (
        <Flex   w="100%" fontSize={'lg'} /*margin="4% 0"*/>
            <NavLink    to={props.path}>
                <Text>{props.name}</Text>
            </NavLink>
        </Flex>
        )
    }

    return (
        <Flex 
            flex={1} 
            margin="15px" 
            flexDirection={"column"} 
            w={"95%"}
            overflowX={'auto'}
        >
            <Text 
                fontSize={'xx-large'}
                fontWeight={'bold'}
                marginBottom={'15px'}
                textColor={'black'}
            >
                Parameters
            </Text>
            <Stack>
                <Flex   
                    bgColor={"#edf2f7"}
                    flexDirection={"column"}
                    borderRadius="20px"
                >
                    <Flex
                        padding={'10px 10px'} 
                        alignItems={'center'}
                    >
                        <Icon 
                            as={CgProfile}
                            boxSize={'40px'}
                            color={'#A659EC'}
                        />
                        <Box paddingLeft={'10px'} >
                            <NavLinkSettings
                                path={"/settings/profile"} 
                                name={"Modify your profile"}
                            />
                            <Text 
                                fontSize={'small'}
                                opacity={'70%'}
                            >
                                You can update here your information
                            </Text>
                        </Box>
                    </Flex>
                    {/* <Flex>
                        <NavLinkSettings path={"/settings/hobbies"} name={"hobbies"}/>
                    </Flex> */}
                
                    <Flex
                        padding={'10px 10px'} 
                        alignItems={'center'}
                    >
                        <Icon 
                            as={MdAddAPhoto}
                            boxSize={'40px'}
                            color={'#A659EC'}
                        />
                        <Box paddingLeft={'10px'} >
                            <NavLinkSettings path={"/settings/photos"} name={"Photos"}/>
                            <Text 
                                fontSize={'small'}
                                opacity={'70%'}
                            >
                                Change your main photo, upload new one
                            </Text>
                        </Box>
                    </Flex>
                </Flex>
                <Flex   
                    bgColor={"#edf2f7"}
                    flexDirection={"column"}
                    borderRadius="20px"
                >
                      <Flex
                        padding={'10px 10px'} 
                        alignItems={'center'}
                    >
                        <Icon 
                            as={TbFilter}
                            boxSize={'40px'}
                            color={'#A659EC'}
                        />
                        <Box paddingLeft={'10px'} >
                            <NavLinkSettings 
                                path={"/settings/filter"} 
                                name={"Filter"}/>
                            <Text 
                                fontSize={'small'} 
                                opacity={'70%'}
                            >
                                Change your location, change your filter parameters (distance, age, hobbies)
                            </Text>
                        </Box>
                    </Flex>
                </Flex>
                <Flex   
                    bgColor={"#edf2f7"}
                    flexDirection={"column"}
                    borderRadius="20px"
                >
                    <Flex
                        padding={'10px 10px'} 
                        alignItems={'center'}
                    >
                         <Icon 
                            as={FaRegHeart}
                            boxSize={'40px'}
                            color={'#A659EC'}
                        />
                        <Box paddingLeft={'10px'} >
                            <NavLinkSettings 
                                path={"/settings/liked_list"} 
                                name={"Likes"}
                            />
                            <Text 
                                fontSize={'small'} 
                                opacity={'70%'}
                            >
                                Revisit your like, unlike if you change your mind
                            </Text>
                        </Box>
                    </Flex>
                    <Flex
                        padding={'10px 10px'} 
                        alignItems={'center'}
                    >
                         <Icon 
                            as={FaHeartPulse}
                            boxSize={'40px'}
                            color={'#A659EC'}
                        />
                        <Box paddingLeft={'10px'} >
                            <NavLinkSettings 
                                path={"/settings/match_list"} 
                                name={"Matches"}
                            />
                            <Text 
                                fontSize={'small'} 
                                opacity={'70%'}
                            >
                                List of your matches, unmatch if you change your mind
                            </Text>
                        </Box>
                    </Flex>
                    <Flex
                        padding={'10px 10px'} 
                        alignItems={'center'}
                    >
                         <Icon 
                            as={RiSpyFill}
                            boxSize={'40px'}
                            color={'#A659EC'}
                        />
                        <Box paddingLeft={'10px'} >
                            <NavLinkSettings 
                                path={"/settings/visits_list"} 
                                name={"Visitors"}
                            />
                            <Text 
                                fontSize={'small'} 
                                opacity={'70%'}
                            >
                                See all the users who visit your profile
                            </Text>
                        </Box>
                    </Flex>
                </Flex>
            </Stack>
        </Flex>
    )
}

export default Settings;