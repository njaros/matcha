import { tokenReader } from "../../tools/TokenReader";
import { storeTimeout } from "../../tools/Stores";
import Axios from "../../tools/Caller";
import { Box, Button, Spinner, transition } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IListUser, ISwipeUser, IPhoto } from "../../Interfaces";
import { DateTools } from "../../tools/DateTools";
import UserList from "./UserList";
import UserProfile from "./UserProfile";

const Home: React.FC = () => {

    const [ visitorList, setVisitorList ] = useState<IListUser[]>([]);
    const [ likedList, setLikedList ] = useState<IListUser[]>([]);
    const [ matchedList, setMatchedList ] = useState<IListUser[]>([]);
    const [ profileId, setProfileId ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ selfId, setSelfId ] = useState<string>("")
    const [ user, setUser ] = useState<ISwipeUser>({
        id: "",
        username: "",
        age: 0,
        gender: "",
        rank: 0,
        biography: "",
        location: "",
        photos: [{id: '0', htmlSrcImg: "default-user.png", main: true}],
        hobbies: [],
        love: false,
        loved: false
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

    function ParsePhotosFromBack(toParse: {id: string, binaries: string, mimetype: string}[])
    {
        const parsed: IPhoto[] = [];
        if (toParse.length > 0)
        {
            toParse.map((photo: any) => {
                parsed.push({
                    id: photo.id,
                    htmlSrcImg: "data:".concat(photo.mimetype)
                    .concat(";base64,")
                    .concat(photo.binaries),
                    main: photo.main
                });
            })
        }
        else
        {
            parsed.push({
                id: '0',
                htmlSrcImg: "default-avatar.png",
                main: true
            });
        }
        return parsed;
    }

    function parsePhotoFromBack(user: any)
    {
        if (user.photo == undefined || user.photo == undefined)
            return "default-avatar.png"
        return "data:".concat(user.mime_type).concat(";base64,").concat(user.binaries)
    }

    function getSelfProfile()
    {
        setLoading(true);
        Axios.get("user/get_self_profile").then(
            response => {
                const photos = ParsePhotosFromBack(response.data.photos);
                setUser({
                    id: response.data.id,
                    username: response.data.username,
                    age: DateTools.ageFromDate(response.data.birthdate),
                    gender: response.data.gender,
                    rank: response.data.rank,
                    biography: response.data.biography,
                    location: getPosInfo(response.data.location),
                    photos: photos,
                    hobbies: response.data.hobbies,
                    love: response.data.love,
                    loved: false
                });
                setProfileId(response.data.id);
                setSelfId(response.data.id);
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
                const photos = ParsePhotosFromBack(response.data.photos);
                setUser({
                    id: response.data.id,
                    username: response.data.username,
                    age: DateTools.ageFromDate(response.data.birthdate),
                    gender: response.data.gender,
                    rank: response.data.rank,
                    biography: response.data.biography,
                    location: getPosInfo(response.data.location),
                    photos: photos,
                    hobbies: response.data.hobbies,
                    love: response.data.love,
                    loved: false
                });
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
                        photo: parsePhotoFromBack(elt)})
                })
                setVisitorList(newList);
            }
        ).catch(
            err => {
                console.warn(err);
            }
        )
    }

    function getLiked()
    {
        Axios.get("relationship/get_liked_not_matched").then(
            response => {
                console.log(response.data)
                let newList: IListUser[] = [];
                response.data.map((elt: any) => {
                    newList.push({
                        id: elt.id,
                        username: elt.username,
                        at: "",
                        photo: parsePhotoFromBack(elt)})
                })
                setLikedList(newList);
            }
        ).catch(
            err => {
                console.warn(err);
            }
        )
    }

    function getMatched()
    {
        Axios.get("relationship/get_matches").then(
            response => {
                let newList: IListUser[] = [];
                response.data.map((elt: any) => {
                    newList.push({
                        id: elt.id,
                        username: elt.username,
                        at: "",
                        photo: parsePhotoFromBack(elt)})
                })
                setMatchedList(newList);
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
        console.log(e.currentTarget.value)
        setProfileId(e.currentTarget.value);
        setSwitchProfile(true);
    }

    function likeHandler(e: any) {
        Axios.post("swipe/like_user", {user_id: e.currentTarget.value}).then(
            () => {

            }
        ).catch(
            err => {
                console.warn(err);
            }
        )
    }

    function removeLikeHandler(e: any) {

    }

    useEffect(() => {
        getSelfProfile();
        getVisitors();
        getMatched();
        getLiked();
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
                        <UserList userList={visitorList} ClickOnUserHandler={changeProfileId} enableDate={true}/>
                        <UserList userList={likedList} ClickOnUserHandler={changeProfileId} enableDate={false}/>
                        <UserList userList={matchedList} ClickOnUserHandler={changeProfileId} enableDate={false}/>
                </Box>
                <Box    className="profile"
                        width={switchProfile ? "100%" : "0"}
                        transition="width 0.7s ease"
                        backgroundColor="green"
                        display="flex"
                        >
                        {loading ? <Spinner size="xl"
                                            color="blue.500"
                                            emptyColor="gray"
                                            speed="0.8s"
                                            thickness="4px" /> :
                        <UserProfile    user={user}
                                        self={selfId == user.id}
                                        likeHandler={likeHandler}
                                        returnHandler={switchHandler} />
                        }
                </Box>
            </Box>
		</Box>
	)
}

export default Home;
