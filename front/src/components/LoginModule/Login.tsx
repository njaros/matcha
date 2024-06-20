import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ILoginInForm } from "../../Interfaces";
import Axios from "../../tools/Caller";
import { cookieMan } from "../../tools/CookieMan";
import { storeGps } from "../../tools/Stores";
import { AiFillWarning } from "react-icons/ai";
import { Box, Button, Flex, Icon, Input, Link, Spinner, Stack, Text } from "@chakra-ui/react";

const Login = (props:{
    handleLog: (newState: boolean) => void,
    handleAccess: (newAccess: string) => void}) =>
{
	const navigate = useNavigate();
	const location = useLocation();
    const { register, handleSubmit } = useForm<ILoginInForm>();
	const [wrong, setWrong] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { gps, updateGpsLatLng } = storeGps();
    const { fixed, updateGpsFixed } = storeGps();
    const [ errorMsg, setErrorMessage ] = useState<string>("");

	const loginSubmit = (data: ILoginInForm) => {
        setLoading(true);
        if (gps != undefined)
        {
            data.latitude = gps.latitude;
            data.longitude = gps.longitude;
        }
		Axios.post("login", data, {withCredentials: true})
			.then(response => {
				console.log(response);
				if (response.status == 200)
				{
					cookieMan.addCookie('token', response.data.access_token);
                    console.log(response.data);
                    updateGpsLatLng({
                        latitude: response.data.latitude,
                        longitude: response.data.longitude
                    });
                    updateGpsFixed(response.data.gpsfixed);
                    props.handleAccess(response.data.access_token);
                    props.handleLog(true);
					const from = (location.state as any)?.from || "/";
					navigate(from);
				}
				else
				{
                    console.log(response)
					setWrong(true);
				}
        })
        .catch(error => {
            console.warn(error)
            if (error.response)
                setErrorMessage(error.response.data)
            else
                setErrorMessage("Unhandled error")
            setWrong(true);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return (
    <Flex 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        w={'100%'}
        h={'100%'}
        className="login_page"

        
    >
        <Flex         
            flexDirection="column"        
            backgroundImage={"url('../../assets/images/62335-cropped.jpg')"}
        
            backgroundPosition="top"
            backgroundRepeat="no-repeat"
            backgroundSize="contain"
        >
            <Text
            textAlign={'center'}
            fontSize={'x-large'}
            fontWeight={'bold'}
            paddingTop={'220px'}
            paddingBottom={'10px'}>
            Welcome back !
            </Text>
            <form className="login_form" onSubmit={handleSubmit(loginSubmit)}>
                <Flex
                    flexDirection="column" 
                    
                >
                    <Stack spacing={1}>
                        <Box paddingBottom={'5px'}>
                        <Input
                            w={'100%'}
                            className="email_input"
                            {...register("email", {required: true})}
                            type="text"
                            placeholder="Enter your email..." 
                        />
                    </Box>
                    <Box paddingBottom={'5px'}>
                        <Input
                            w={'100%'} 
                            className="password_input"
                            {...register("password", {required: true})}
                            type="password"
                            placeholder="Enter your password..."
                        />
                    </Box>
                    </Stack>
                    
                    {wrong && <Flex alignItems={"center"}>
                            <Icon margin="0 3px" as={AiFillWarning} color={"red"}/>
                            <Text color="red" fontSize={"13px"} className="log_error">{errorMsg}</Text>
                        </Flex>}
                    {loading ?
                        <Spinner color="purple" size="lg"/> :
                        <Flex direction={"column"}>
                            <NavLink to="/forgot">
                                <Text color={"#A659EC"} margin="10px 0" fontSize={"14px"} padding="4px">Forgot your password ?</Text>
                            </NavLink>
                            <Button 
                                className="submit_button" 
                                type="submit"
                                bg="#A659EC"
                                color={"white"}
                                >
                                Login
                            </Button>
                        </Flex>}
                    
                </Flex>
            </form>
            <Flex 
                marginTop={'5px'}
                justifyContent={'center'}
            >
                <Text 
                    fontSize={'small'} 
                    >
                    Don't have an account ?{" "}
                </Text>       
                <NavLink to={'/signUp'}>
                    <Text 
                        fontSize={'small'} 
                        marginLeft={'5px'}
                        textColor={'#A659EC'}
                        >
                        Sign up
                    </Text>
                </NavLink>
            </Flex>
        </Flex>
        
    </Flex>
    )
}

export default Login;