import { Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdAddAPhoto } from "react-icons/md";
import { TbFilter } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { FaHeartPulse } from "react-icons/fa6";
import { RiSpyFill } from "react-icons/ri";
import { GiHouseKeys } from "react-icons/gi";
import { IconType } from "react-icons";

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

    function SettingElement(props: {path: string, name: string, desc: string, icon: IconType})
    {
        return (
            <Flex
                padding={'10px 10px'} 
                alignItems={'center'}
                >
                <NavLink    to={props.path}>
                    <Flex>
                        <Icon 
                                as={props.icon}
                                boxSize={'40px'}
                                color={'#A659EC'}
                                />
                            <Box paddingLeft={'10px'} >
                                <Flex   w="100%" fontSize={'lg'} /*margin="4% 0"*/>
                                    <Text>{props.name}</Text>
                                </Flex>
                                <Text 
                                    fontSize={'small'}
                                    opacity={'70%'}
                                    >
                                    {props.desc}
                                </Text>
                            </Box>
                    </Flex>
                </NavLink>
            </Flex>
        )
    }

    return (
        <Flex 
            flex={1} 
            flexDirection={"column"} 
            w={"95%"}
            overflow={"hidden"}
        >
            <Text 
                fontSize={'xx-large'}
                fontWeight={'bold'}
                margin="10px 10px"
            >
                Parameters
            </Text>
            <Stack
                overflowY={"auto"}>
                <Flex   
                    bgColor={"#edf2f7"}
                    flexDirection={"column"}
                    borderRadius="20px"
                >
                    <SettingElement 
                        path="/settings/profile"
                        name="Modify your profile"
                        desc="You can update here your information"
                        icon={CgProfile}/>
                    <SettingElement
                        path="/settings/photos"
                        name="Photos"
                        desc="Change your main photo, upload new one"
                        icon={MdAddAPhoto}/>
                    <SettingElement
                        path="/settings/change_password"
                        name="Change password"
                        desc="Change your password"
                        icon={GiHouseKeys}/>
                </Flex>
                <Flex   
                    bgColor={"#edf2f7"}
                    flexDirection={"column"}
                    borderRadius="20px"
                >
                    <SettingElement
                        path="/settings/filter"
                        name="Filter"
                        desc="Change your location, change your filter parameters (distance, age, hobbies)"
                        icon={TbFilter}/>
                </Flex>
                <Flex   
                    bgColor={"#edf2f7"}
                    flexDirection={"column"}
                    borderRadius="20px"
                >
                    <SettingElement
                        path="/settings/liked_list"
                        name="Likes"
                        desc="See who like you, unlike if you change your mind"
                        icon={FaRegHeart}/>
                    <SettingElement
                        path="/settings/match_list"
                        name="Matches"
                        desc="List of your matches, unmatch if you change your mind"
                        icon={FaHeartPulse}/>
                    <SettingElement
                        path="/settings/visits_list"
                        name="Visitors"
                        desc="See all the users who visit your profile"
                        icon={RiSpyFill}/>
                </Flex>
            </Stack>
        </Flex>
    )
}

export default Settings;