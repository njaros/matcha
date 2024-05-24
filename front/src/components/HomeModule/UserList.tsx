import { Box, Button, Card, Icon, Image, Text } from "@chakra-ui/react";
import { IListUser } from "../../Interfaces";
import { useEffect } from "react";
import { CgProfile } from "react-icons/cg";

export default function UserList(props: {userList: IListUser[], ClickOnUserHandler: (e: any) => void})
{
    useEffect(() => {
        console.log("hello", props.userList)
    }, [])

    return (
        <Box    className="userList"
                display="flex"
                flexDirection="column"
                height="96%"
                overflowY="auto"
                >
            {props.userList.map((user) => {
                return <Button  bgColor="purple"
                                h="10%"
                                flexDirection="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                borderRadius="unset"
                                borderColor="black"
                                borderBottomWidth="1px"
                                value={user.id}
                                onClick={props.ClickOnUserHandler}
                                >
                    <Image  objectFit="contain"
                            maxH="100%"
                            src={user.photo}/>
                    <Text   margin="0 5%">
                        {user.username}
                    </Text>
                    <Text>
                        {user.at}
                    </Text>
                </Button>
            })}
        </Box>
    )
}