import { Flex, Img } from "@chakra-ui/react";

export default function NoMatch() {
    return (
        <Img flex={1} objectFit={"contain"} src="404.jpg"/>
    )
}