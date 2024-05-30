import { Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function ReturnButton(props: {to: string}) {
    return (
        <NavLink to={props.to}>
            <Text>Return to menu</Text>
        </NavLink>
    )
}