import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Box } from "@chakra-ui/react"
//Ici qu'il faudra mettre les modules du genre pop-ups qui doivent pop de n importe ou
const Layout = (props: {
    logged: boolean,
    handleLog: (newState: boolean) => void,
    handleAccess: (newAccess: string) => void}) =>
{
    return (
        <Box    display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="100%">
            <Header logged={props.logged} handleLog={props.handleLog} handleAccess={props.handleAccess} />
            <Box height="100%">
                <Outlet />
            </Box>
            <Footer />
        </Box>
    )
}

export default Layout;