import { useForm } from "react-hook-form";
import { IChangePass } from "../../Interfaces";
import { Box, Button, Flex, Icon, Image, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { AiFillWarning } from "react-icons/ai";
import { useState } from "react";
import Axios from "../../tools/Caller";
import ReturnButton from "./ReturnButton";

export default function ChangePassword() {
    const { register, handleSubmit } = useForm<IChangePass>();
    const [ jobDone, setJobDone ] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [ errorMsg, setErrorMessage ] = useState<string>("");


    const changePassSubmit = (data: IChangePass) => {
        if (data.currentPassword == data.newPassword)
            setErrorMessage("Your new password must be different");
        else if (data.newPassword != data.newPasswordRepeat)
            setErrorMessage("Your new password was uncorrectly repeated")
        else
        {
            setLoading(true);
            Axios.post("change_password", data).then(
                response => {

                }
            ).catch(
                err => {
                    if (err.response)
                        setErrorMessage(err.response.data.message)
                    else
                        setErrorMessage("unhandled error")
                }
            ).finally(
                () => setLoading(false))
        }
    }

    return (
        <Flex
                flex={1}
                flexDirection={"column"}
                justifyContent={"flex-start"}
                overflow={"hidden"}
                w="100%"
                h="100%">
            <Flex
                w="100%"
                flexDirection={"row"}
                margin="10px 0 0 10px">
                <Box alignSelf={"center"}>
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
            <Flex
                    flex={1}
                    className="changePass"
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    w={"100%"}
                    h={"100%"}>
                        <Image  src="/changePass.avif"
                                width={"200px"}/>
                        <Text
                            textAlign={"center"}
                            fontSize={'x-large'}
                            fontWeight={"bold"}
                            paddingBottom={"10px"}>
                                Change your password
                        </Text>
                        {jobDone ? <Text margin="100px 0" fontWeight={"bold"} placeSelf={"center"}>Password updated</Text> :
                <form className="login_form" onSubmit={handleSubmit(changePassSubmit)} style={{width: "80%"}}>
                    <Flex
                        flexDirection="column"
                        >
                        <Stack spacing={1}>
                            <Box paddingBottom={'5px'}>
                            <Input
                                w={'100%'}
                                className="current_password_input"
                                {...register("currentPassword", {required: true})}
                                type="password"
                                variant="flushed"
                                placeholder="Enter your current password..." 
                                />
                            </Box>
                            <Box paddingBottom={'5px'}>
                            <Input
                                w={'100%'}
                                className="new_password_input"
                                {...register("newPassword", {required: true})}
                                type="password"
                                variant="flushed"
                                placeholder="Enter your new password..." 
                                />
                            </Box>
                            <Box paddingBottom={'5px'}>
                            <Input
                                w={'100%'}
                                className="new_password_repeat_input"
                                {...register("newPasswordRepeat", {required: true})}
                                type="password"
                                variant="flushed"
                                placeholder="repeat your new password..." 
                                />
                            </Box>
                        </Stack>
                        
                        {errorMsg != "" && <Flex alignItems={"center"}>
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
                                    Send
                                </Button>
                            </Flex>}
                        
                    </Flex>
                </form>}
            </Flex>
        </Flex>
    )
}