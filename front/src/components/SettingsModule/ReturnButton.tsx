import { Button, Icon, Text } from "@chakra-ui/react";
import { IoChevronBack } from "react-icons/io5";
import { NavLink } from "react-router-dom";

export default function ReturnButton(props: {to: string | number}) {
    return (
        <NavLink to={props.to}>
            <Button
                borderRadius={'100%'}
                padding={'0'}
                size={'sm'}
                bgColor={'#edf2f'}
            >
                <Icon as={IoChevronBack} />
            </Button>
        </NavLink>
    )
}