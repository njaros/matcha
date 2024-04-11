import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Box } from "@chakra-ui/react"
//Ici qu'il faudra mettre les modules du genre pop-ups qui doivent pop de n importe ou
const Layout = () => {
    return (
        <Box display="flex" flexDirection="column" justifyContent="space-between">
            <Header />
            <Outlet />
            <Footer />
        </Box>
    )
}

export default Layout;