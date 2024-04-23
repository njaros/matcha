import { useEffect, useState } from "react";
import Axios from "../../tools/Caller";
import { IUser } from "../../Interfaces";
import { Box, Textarea, List, ListItem, Image, Button, FormControl, Input, Text, Center } from "@chakra-ui/react"
import { useForm } from "react-hook-form";

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
                <Text width="30%" marginRight="5%" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">Your {props.title}</Text>
                {props.readonly ?
                <Input margin="4px" readOnly value={props.val}/> :
                <Input margin="4px" {...register(props.title)} />
                }
            </Box>
        )
    }

    const InputUserBiography = (props: {readonly: boolean, val: string}) => {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Text width="30%" marginRight="5%" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">Your Biography</Text>
                {props.readonly ?
                <Textarea readOnly defaultValue={props.val}/> :
                <Textarea {...register("biography")}/>
                }
            </Box>
        )
    }

    const profileSubmit = (data: IUser) => {
        console.log("data = ", data);
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
                console.log(response);
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
        <Box    display="flex" flexDirection="column">
            <Center fontSize="xxx-large">PROFILE PAGE</Center>
            {user?
            <form onSubmit={handleSubmit(profileSubmit)}>
                <FormControl    display="flex" flexDirection="column">
                    <Box display="flex" flexDirection="column" margin = "5%">
                        <Center marginBottom="5%">ACCOUNT INFO</Center>
                        <InputUser readonly={readOnly} val={user.username} title="username"/>
                        <InputUser readonly={readOnly} val={user.email} title="email"/>
                        <InputUser readonly={readOnly} val={user.birthdate} title="birthdate"/>
                        <InputUser readonly={readOnly} val={user.gender} title="gender"/>
                        <InputUser readonly={readOnly} val={user.preference} title="preference"/>
                        <InputUserBiography readonly={readOnly} val={user.biography}/>
                    </Box>
                    {readOnly?
                    <Button onClick={toggleReadonly}>Modify profile</Button> :
                    <Box display="flex" >
                        <Button width="80%" onClick={toggleReadonly}>Cancel</Button>
                        <Button marginLeft="5%" width="15%" type="submit">Send</Button>
                    </Box>
                    }
                </FormControl>
            </form>
            : null}
        </Box>
    );
}

export default Profile;
