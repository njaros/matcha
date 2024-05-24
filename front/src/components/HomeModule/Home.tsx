import { tokenReader } from "../../tools/TokenReader";
import { storeTimeout } from "../../tools/Stores";
import Axios from "../../tools/Caller";
import { Box, Button, Spinner, transition } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IListUser, ISwipeUser, IUser } from "../../Interfaces";
import UserList from "./UserList";
import { set } from "react-hook-form";
import OtherProfile from "./OtherProfile";

const Home: React.FC = () => {

    const [ visitorList, setVisitorList ] = useState<IListUser[]>([]);
    const [ profileId, setProfileId ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ user, setUser ] = useState<ISwipeUser>({
        id: "",
        username: "",
        age: 0,
        gender: "",
        rank: 0,
        biography: "",
        location: "",
        photos: [],
        hobbies: [],
        love: false
    })
    const [ switchProfile, setSwitchProfile ] = useState<boolean>(true);

    function getPosInfo(location: any)
    {
        if (location != null && location != undefined)
        {
            return location.city != undefined ?
            location.city :
            location.village != undefined ?
            location.village :
            location.town != undefined ?
            location.town :
            location.county != undefined ?
            location.county :
            location.state != undefined ?
            location.state : 
            location.country != undefined ?
            location.country : "";
        }
        return "";
    }

    function getSelfProfile()
    {
        setLoading(true);
        Axios.get("user/get_self_profile").then(
            response => {
                setUser(response.data);
                setProfileId(response.data.id);
            }
        ).catch(
            error => {
                console.log(error);
            }
        ).finally(() => {
            setLoading(false);
        })
    }

    function getOtherProfile()
    {
        setLoading(true);
        Axios.post("user/get_user_profile", { user_id: profileId }).then(
            response => {
                setUser(response.data);
            }
        ).catch(
            error => {
                console.log(error);
            }
        ).finally(() => {
            setLoading(false);
        })
    }

    function getVisitors()
    {
        Axios.get("user/get_visits_history").then(
            response => {
                console.log(response);
                let newList: IListUser[] = [];
                response.data.map((elt: any) => {
                    newList.push({
                        id: elt.id,
                        username: elt.username,
                        at: elt.at,
                        photo:"data:".concat(elt.mime_type)
                        .concat(";base64,")
                        .concat(elt.binaries)})
                })
                setVisitorList(newList);
            }
        ).catch(
            err => {
                console.warn(err);
            }
        )
    }

    function switchHandler() {
        setSwitchProfile(!switchProfile)
    }

    function changeProfileId(e: any) {
        setProfileId(e.currentTarget.value);
        setSwitchProfile(true);
    }

    function backToSelfProfileHandler() {
        getSelfProfile();
    }

    function likeHandler(e: any) {

    }

    useEffect(() => {
        getSelfProfile();
        getVisitors();
    }, [])

    useEffect(() => {
        if (profileId != "")
            getOtherProfile()
    }, [profileId])

	return (
		<Box flexGrow={1} display="flex" width="100%" overflow="hidden" justifyContent="space-evenly" flexDirection="column">
            <Box    alignSelf="center">Hello {user.username}</Box>
            <Box    height="100%"
                    display="flex"
                    justifyContent="center"
                    flexDirection="row"
                    >
                <Box    className="userLists"
                        width={switchProfile ? "0" : "100%"}
                        transition="width 0.7s ease"
                        backgroundColor="blue"
                        >
                        <UserList userList={visitorList} ClickOnUserHandler={changeProfileId} />
                </Box>
                <Box    className="profile"
                        width={switchProfile ? "100%" : "0"}
                        transition="width 0.7s ease"
                        backgroundColor="green"
                        >
                        {loading ? <Spinner size="xl"
                                            color="blue.500"
                                            emptyColor="gray"
                                            speed="0.8s"
                                            thickness="4px" /> :
                        <OtherProfile   user={user}
                                        likeHandler={likeHandler}
                                        returnHandler={switchHandler}
                                        backToSelfProfile={backToSelfProfileHandler} />
                        }
                </Box>
            </Box>
		</Box>
	)
}

export default Home;
