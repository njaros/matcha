import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { Box, useToast } from "@chakra-ui/react"
import { storeSocket } from "../../tools/Stores";
import { useEffect } from "react";
//Ici qu'il faudra mettre les modules du genre pop-ups qui doivent pop de n importe ou

const Layout = (props: {handleAccess: (newAccess: string) => void}) =>
{
    return (
        <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                height="100%"
                width="100%"
                gap={'10px'}
                bg={'white'}
                textColor={'black'}
                >
            <Outlet />
            <Footer handleAccess={props.handleAccess} />
        </Box>
    )
}

export default Layout;