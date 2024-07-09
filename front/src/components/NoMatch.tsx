import { Flex, Img } from "@chakra-ui/react";

export default function NoMatch() {
    return (
        <Flex flex={1}>
            <Img objectFit={"contain"} src="404.jpg"/>
        </Flex>
    )
}