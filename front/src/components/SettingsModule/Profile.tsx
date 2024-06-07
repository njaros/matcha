import { useEffect, useState } from "react";
import Axios from "../../tools/Caller";
import { IUser } from "../../Interfaces";
import { Box, Textarea, List, ListItem, Image, Button, FormControl, Input, Text, Center } from "@chakra-ui/react"
import { useForm } from "react-hook-form";
import ReturnButton from "./ReturnButton";
import Hobbies from "./Hobbies";

const Profile = () => {
    const [user, setUser] = useState<IUser>();
    const [readOnly, setReadOnly] = useState<boolean>(true);
    const { register, handleSubmit, setValue } = useForm<IUser>();
    const [errorMsg, setErrorMsg] = useState<{"section": string, "message": string}>({"section": "", "message": ""});

    function getUserProfile()
    {
        Axios.get("user/get_user_by_id").then(
            response => {
                console.log(response.data);
                setUser(response.data);
                setValue("username", response.data.username);
                setValue("email", response.data.email);
                setValue("birthdate", response.data.birthDate);
                setValue("biography", response.data.biography);
                setValue("gender", response.data.gender);
                setValue("preference", response.data.preference);
            }
        ).catch(
            error => {
                if (error.response.data.message != undefined)
                    setErrorMsg({   "section": "getUserProfile", 
                                    "message": error.response.data.message});
                else
                    setErrorMsg({   "section": "getUserProfile",
                                    "message": "unhandled error "
                                                    .concat(error.response.status.toString())});
                console.log(error);
            }
        )
    }

    useEffect(() => {
        getUserProfile();
    }, [])

    const toggleReadonly = () =>
    {
        setReadOnly(!readOnly);
        if(user)
        {
            setValue("username", user.username);
            setValue("email", user.email);
            setValue("birthdate", user.birthdate);
            setValue("biography", user.biography);
            setValue("gender", user.gender);
            setValue("preference", user.preference);
        }
    }

    const InputUser = (props: {readonly: boolean, val: string, title: "email" | "username" | "birthdate" | "gender" | "biography" | "preference"}) => {
        return (
            <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                {props.readonly ?
                <Input margin="4px" borderRadius={"full"} bgColor={"blue"} readOnly value={props.val}/> :
                <Input margin="4px" borderRadius={"full"} {...register(props.title)} />
                }
            </Box>
        )
    }

    const InputUserBiography = (props: {readonly: boolean, val: string}) => {
        return (
            <Box display="flex" width={"100%"} flexDirection="column" justifyContent="center" alignItems="center">
                {props.readonly ?
                <Textarea readOnly bgColor={"red"} borderRadius={"25px"} defaultValue={props.val}/> :
                <Textarea borderRadius={"5%"} {...register("biography")}/>
                }
            </Box>
        )
    }

    const profileSubmit = (data: IUser) => {
        const form = new FormData();
        if (data.username != user?.username)
            form.append("username", data.username);
        if (data.email != user?.email)
            form.append("email", data.email);
        if (data.birthdate != user?.birthdate)
            form.append("birthDate", data.birthdate);
        if (data.biography != user?.biography)
            form.append("biography", data.biography);
        if (data.gender != user?.gender)
            form.append("gender", data.gender);
        if (data.preference != user?.preference)
            form.append("preference", data.preference);
        Axios.post("profile/update_user", form).then(
            response => {
                setUser(response.data.updated_user)
            }
        ).catch(
            error => {
                console.log(error);
            }
        ).finally(
            () => {
                toggleReadonly();
            }
        )
    }

    return (
        <Box    display="flex" flex={1} width={"85%"} justifyContent={"flex-end"} flexDirection="column">
            {user?
            <form onSubmit={handleSubmit(profileSubmit)}>
                <FormControl    alignItems={"center"} display="flex" flexDirection="column">
                    <Box display="flex" alignItems={"center"} flexDirection="column" margin = "5%">
                        <Center marginBottom="5%" fontSize={"x-large"} fontWeight={"bold"}>
                            {readOnly ? "Your account info"
                            : "Modify your info"}
                        </Center>
                        <InputUser readonly={readOnly} val={user.username} title="username"/>
                        <InputUser readonly={readOnly} val={user.email} title="email"/>
                        <InputUser readonly={readOnly} val={user.birthdate} title="birthdate"/>
                        <InputUser readonly={readOnly} val={user.gender} title="gender"/>
                        <InputUser readonly={readOnly} val={user.preference} title="preference"/>
                        <InputUserBiography readonly={readOnly} val={user.biography}/>
                    </Box>
                    {readOnly?
                    <Button w="75%" onClick={toggleReadonly}>Modify profile</Button> :
                    <Box display="flex" w="75%" flexDirection={"row"}>
                        <Button marginRight="5%" flex={1} type="submit">Send</Button>
                        <Button onClick={toggleReadonly}>Cancel</Button>
                    </Box>
                    }
                </FormControl>
            </form>
            : null}
            <ReturnButton to="/settings"/>
        </Box>
    );
}

export default Profile;
