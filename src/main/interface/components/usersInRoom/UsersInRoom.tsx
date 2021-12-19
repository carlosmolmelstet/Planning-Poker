import { Box, Button, Flex, Image, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { Vote } from 'domain/entities';
import { useRoom } from 'main/hooks';
import { UserInfo } from './UserInfo';

type UsersInRoom = {
  roomId: string;
  votes?: Vote[];
}

export function UsersInRoom({ roomId , votes}: UsersInRoom) {
  const { lastTask } = useRoom(roomId);

  const { users } = useRoom(roomId);
  return (
    <SimpleGrid  bg="gray.900" borderRadius={8} p={2} columns={2} gap={4}>
      {users.map(user => {
        var effort = votes?.find(vote => vote.user.id == user.id)?.effort;
        return (
          <UserInfo key={user.id} user={user} effort={effort} hiddenVotes={lastTask?.hiddenVotes} />
        )
      })}
    </SimpleGrid>
  );
}