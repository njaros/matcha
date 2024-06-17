import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import Axios from "../../tools/Caller";
import { AiFillWarning } from "react-icons/ai";
import { Box, Button, Flex, Input, Image, Icon, Spinner, Stack, Text } from "@chakra-ui/react";

const Forgot = () =>
{
	const navigate = useNavigate();
    const { register, handleSubmit } = useForm<{email: string}>();
    const [ jobDone, setJobDone ] = useState<boolean>(false)
	const [wrong, setWrong] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [ errorMsg, setErrorMessage ] = useState<string>("");

	const forgotSubmit = (data: {email: string}) => {
        setLoading(true);
        Axios.post("reset_password", data).then(
            response => {
                setJobDone(true)
                setTimeout(() => navigate("/login"), 4000)
            }
        ).catch(
            err => {
                console.warn(err)
                setWrong(true)
                if (err.response)
                    setErrorMessage(err.response.data.message)
                else
                    setErrorMessage("unhandled error")
            }
        ).finally(
            () => setLoading(false)
        )
    }

    return (
    <Flex 
        flexDirection="column" 
        alignItems="center"
        justifyContent="center"
        w={'100%'}
        h={'100%'}
        className="login_page">
            <Image  src="forgot.jpg"
                    width="250px"
                    />
            <Text
                textAlign={'center'}
                fontSize={'x-large'}
                fontWeight={'bold'}
                paddingBottom={'10px'}>
            Reset your password
            </Text>
            {jobDone ? <Text margin="20px 0" fontWeight={"bold"} placeSelf={"center"}>A mail as been sent<br/>Follow the mail instructions</Text> :
            <form className="login_form" onSubmit={handleSubmit(forgotSubmit)}>
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
                    </Stack>
                    
                    {wrong && <Flex alignItems={"center"}>
                            <Icon margin="0 3px" as={AiFillWarning} color={"red"}/>
                            <Text color="red" fontSize={"13px"} className="log_error">{errorMsg}</Text>
                        </Flex>}
                    {loading ?
                        <Spinner color="purple" size="lg" margin="15px 0"/> :
                        <Flex direction={"column"} margin="15px 0">
                            <Button 
                                className="submit_button" 
                                type="submit"
                                color={"white"}
                                bg="#A659EC"
                                >
                                Get new password
                            </Button>
                        </Flex>}
                    
                </Flex>
            </form>}
            <Flex 
                marginTop={'5px'}
                justifyContent={'center'}
            >    
                    <NavLink to={'/logIn'}>
                        <Text 
                            fontSize={'md'} 
                            marginLeft={'5px'}
                            textColor={'#A659EC'}
                            >
                            Back to Log In
                        </Text>
                    </NavLink>
            </Flex>
    </Flex>
    )
}

export default Forgot;