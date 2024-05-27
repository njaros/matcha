import { Box, Button, Card, Icon, Image, Text } from "@chakra-ui/react";
import { IListUser } from "../../Interfaces";
import { useEffect } from "react";

export default function UserList(props: {userList: IListUser[], ClickOnUserHandler: (e: any) => void, enableDate: boolean})
{
    useEffect(() => {
        console.log("hello", props.userList)
    }, [])

    return (
        <Box    className="userList"
                display="flex"
                flexDirection="column"
                overflowY="auto"
                >
            {props.userList.map((user) => {
                console.log(user)
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
                    {props.enableDate && <Text>
                        {user.at}
                    </Text>}
                </Button>
            })}
        </Box>
    )
}