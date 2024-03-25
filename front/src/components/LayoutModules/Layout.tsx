import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
//Ici qu'il faudra mettre les modules du genre pop-ups qui doivent pop de n importe ou
const Layout = () => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout;