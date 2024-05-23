import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { Box } from "@chakra-ui/react"
//Ici qu'il faudra mettre les modules du genre pop-ups qui doivent pop de n importe ou

const Layout = (props: {
    logged: boolean,
    handleLog: (newState: boolean) => void,
    handleAccess: (newAccess: string) => void}) =>
{
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            height="100%"
            width="100%"
            gap={'10px'}
            >
            <Header />
            <Outlet />
            <Footer logged={props.logged} handleLog={props.handleLog} handleAccess={props.handleAccess} />
        </Box>
    )
}

export default Layout;