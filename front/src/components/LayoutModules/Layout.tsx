import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { Box, useToast } from "@chakra-ui/react"
import { storeSocket } from "../../tools/Stores";
import { useEffect } from "react";
//Ici qu'il faudra mettre les modules du genre pop-ups qui doivent pop de n importe ou

const Layout = (props: {
    logged: boolean,
    handleLog: (newState: boolean) => void,
    handleAccess: (newAccess: string) => void}) =>
{
    const socket = storeSocket(state => state.socket)
    const toast = useToast();

    useEffect(() => {
        if (socket)
        {
            socket.on("send_like", () => {
                console.log("from send_like");
                toast({title: "hello", description: "someone like U"})
            });
            socket.on("test", () => {
                console.log("from socket listener test")
                toast({title: "test", description: "ddd"})
            })
            console.log("notif listener are on");
        }
        return (() => {
            if (socket) {
                socket.off("send_like");
                socket.off("test");
            }
        })
    }, [socket])

    return (
        <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                height="100%"
                width="100%"
                overflowY="auto"
                gap={'10px'}
                bg={'white'}
                >
            <Outlet />
            <Footer logged={props.logged} handleLog={props.handleLog} handleAccess={props.handleAccess} />
        </Box>
    )
}

export default Layout;