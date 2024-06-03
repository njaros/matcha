import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ILoginInForm } from "../../Interfaces";
import Axios from "../../tools/Caller";
import { cookieMan } from "../../tools/CookieMan";
import { storeGps } from "../../tools/Stores";
import { Box, Button, Flex, Input, Link, Spinner, Text } from "@chakra-ui/react";

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
					setWrong(true);
				}
        })
        .catch(error => {
            console.log(error);
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
        flexGrow={1}
        className="login_page"
    >
        <Text 
            fontSize={'x-large'}
            fontWeight={'bold'}
            paddingBottom={'10px'}
        >
            Welcome
        </Text>
        <form className="login_form" onSubmit={handleSubmit(loginSubmit)}>
            <Flex
                flexDirection="column" 
                
            >
                <Box paddingBottom={'5px'}>
                    <Input
                        w={'100%'}
                        className="username_input"
                        {...register("username", {required: true})}
                        type="text"
                        placeholder="Enter your username..." 
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
            {wrong && <div className="log_error">wrong username or password</div>}
            {loading ?
                <Spinner color="purple" size="lg"/> :
                <Button 
                    className="submit_button" 
                    type="submit"
                    bg="#A659EC"
                    
                >
                    Login
                </Button>}
            </Flex>
        </form>
        <Flex 
            alignItems={'center'}
            marginTop={'5px'}
        >
            <Text fontSize={'small'} >
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
    )
}

export default Login;