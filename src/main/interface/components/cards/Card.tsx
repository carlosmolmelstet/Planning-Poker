import { Flex, } from "@chakra-ui/react";

interface CardProps {
    vote: string;
    effort: string;
    setVote: (value: string) => void;
}

export function Card({ vote, effort, setVote }: CardProps) {
    return (
        <Flex
            alignSelf={vote == effort ? "center" : "flex-end"}
            bgGradient={vote == effort ? 'linear(to-r, brand.500, green.500)' : 'linear(to-r, gray.700, gray.700)'} onClick={() => setVote(vote == effort ? "" : effort)}
            h="150px"
            w="100px"
            align="center"
            justify="center"
            transition="4s"
            fontSize={28}
            borderRadius={8}
            _hover={{ alignSelf: "center", cursor: "pointer" }}
        >
            {effort}
        </Flex>
    );
}