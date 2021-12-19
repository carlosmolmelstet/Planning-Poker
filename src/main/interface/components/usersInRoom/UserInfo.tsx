import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { User } from "domain/entities";
import CheckImage from 'main/interface/assets/images/check.svg';
interface UserInfoProps {
    user: User,
    effort?: string
    hiddenVotes?: boolean;
}

export function UserInfo({ user, effort, hiddenVotes = true }: UserInfoProps) {
    return (
        <Flex align="center" position="relative">
            <Avatar src={user.avatar} size="sm" name={user.name} />
            <Text textTransform="capitalize" ml={2} fontSize={16} color="gray.300">{user.name}</Text>
            <Box position="absolute" right={4}>
                {hiddenVotes ? <Image color="red" h={4} w={4} src={CheckImage} /> : effort || "?"}
            </Box>
        </Flex>
    );
}