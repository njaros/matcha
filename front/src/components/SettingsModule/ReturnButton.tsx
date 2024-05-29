import { Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function ReturnButton() {
    return (
        <NavLink to={"/settings/"}>
            <Text>Return to menu</Text>
        </NavLink>
    )
}