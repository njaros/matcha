import { Box, Button, Flex, FormControl, Input, Select, Stack, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IUser } from "../../Interfaces";
import Axios from "../../tools/Caller";
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
            <Box 
                display="flex" 
                flexDirection="column" 
                justifyContent="flex-start" 
                alignItems="center"
                w={'80%'}
            >
                <Text
                    fontWeight={'bold'}
                    width="100%" 
                >
                    {props.title}
                </Text>
                {props.readonly ?
                <Input
                    variant={'filled'}
                    margin="4px" 
                    readOnly value={props.val}
                    borderRadius={'full'}
                /> :
                <Input 
                    margin="4px" {...register(props.title)} 
                    borderRadius={'full'}    
                />
                }
            </Box>
        )
    }

    const InputUserBiography = (props: {readonly: boolean, val: string}) => {
        return (
            <Box 
                display="flex" 
                flexDirection="column" 
                justifyContent="center" 
                alignItems="center"
                w={'80%'}    
            >
                <Text 
                    width="100%"
                    fontWeight={'bold'}
                >
                    Biography
                </Text>
                {props.readonly ?
                <Textarea
                    margin='4px'
                    variant={'filled'}
                    readOnly 
                    defaultValue={props.val}
                    borderRadius={'20px'}
                /> :
                <Textarea
                    borderRadius={'20px'}
                    {...register("biography")}
                />
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
        <Box 
            display="flex" 
            w={'100%'} 
            h={'100%'} 
            flexDirection="column"
            overflow={'hidden'}
        >
            <Flex 
                flexDirection={'row'}
                paddingLeft={'10px'}
                marginTop={'10px'}
                marginBottom={'20px'}
            >
                <Box alignSelf={'center'}>
                    <ReturnButton to="/settings"/>
                </Box>
                <Text
                    fontSize={'xx-large'}
                    alignSelf={'center'}
                    margin={'0px 5px'}
                    fontWeight={'bold'}
                    paddingLeft={'5px'}
                >
                    Profile
                </Text>
            </Flex>
            <Flex overflowY={'auto'} flexDirection={'column'}> 
                {user ?
                <form onSubmit={handleSubmit(profileSubmit)}>
                    <FormControl
                        display="flex" 
                        flexDirection="column"
                    >
                        <Box 
                            display="flex" 
                            flexDirection="column"  
                            w={'100%'} 
                            alignItems={'center'}
                        >
                            <InputUser 
                                readonly={readOnly} 
                                val={user.username} 
                                title="username"
                            />
                            <InputUser 
                                readonly={readOnly} 
                                val={user.email} 
                                title="email"
                            />
                            {!readOnly ? 
                                <Box 
                                    flexDirection="column" 
                                    justifyContent="center" 
                                    alignItems="center"
                                    display="flex" 
                                    w="80%"
                                    >
                                    <Text placeSelf={'flex-start'}>preference</Text>
                                    <Select 
                                        borderRadius={'full'}
                                        margin={'4px'}
                                        {...register("preference", {required: true})}>
                                            <option value="man">man</option>
                                            <option value="woman">woman</option>
                                            <option value="all">all</option> 
                                    </Select>
                                </Box> : 
                                <InputUser 
                                    readonly={readOnly} 
                                    val={user.preference} 
                                    title="preference"
                                /> 
                            }
                            {!readOnly ? 
                                <Box 
                                    flexDirection="column" 
                                    justifyContent="center" 
                                    alignItems="center"
                                    display="flex" 
                                    w="80%"
                                    >
                                    <Text placeSelf={'flex-start'}>gender</Text>
                                    <Select
                                        margin={'4px'}
                                        borderRadius={'full'}
                                        {...register("gender", {required: true})}>
                                            <option value="man">man</option>
                                            <option value="woman">woman</option>
                                    </Select>
                                </Box> : 
                                <InputUser 
                                    readonly={readOnly} 
                                    val={user.gender} 
                                    title="gender"
                                /> 
                            }
                            
                            <InputUserBiography 
                                readonly={readOnly} 
                                val={user.biography}
                            />
                        </Box>
                        <Box 
                            placeSelf={'center'} 
                            w={'45%'}
                            paddingTop={'20px'}
                        >
                            {readOnly?
                            <Button 
                                onClick={toggleReadonly}
                                w={'100%'}
                                placeSelf={'center'}
                                textColor={'white'}
                                bg="#A659EC"
                                borderRadius={'full'}
                            >
                                Modify profile
                            </Button> :
                            <Box 
                                display="flex"
                                justifyContent={'center'} 
                            >
                                <Stack
                                    flexDirection={'column'}
                                    w={'100%'}
                                    spacing={2}
                                >
                                    <Button 
                                    width="100%" 
                                    onClick={toggleReadonly}
                                    textColor={'white'}
                                    bg="#A659EC"
                                    borderRadius={'full'}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    width="100%" 
                                    type="submit"
                                    textColor={'white'}
                                    bg="#A659EC"
                                    borderRadius={'full'}
                                >
                                    Send
                                </Button>
                                </Stack>
                            </Box>
                            }

                        </Box>
                    </FormControl>
                </form>
                : null}
                <Hobbies></Hobbies>
            </Flex>
        </Box>
    );
}

export default Profile;
