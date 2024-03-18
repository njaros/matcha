import { Outlet } from "react-router-dom";
//Ici qu'il faudra mettre les modules du genre pop-ups qui doivent pop de n importe ou
const Layout = () => {
    return (
        <div>          
            <Outlet/>
        </div>
    )
}

export default Layout;