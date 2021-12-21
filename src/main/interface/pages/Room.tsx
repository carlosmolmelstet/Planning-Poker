import { Box, Container, Flex, Grid, GridItem, Heading, HStack, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from 'main/hooks/';
import { TasksEmpty, UsersInRoom } from '../components';
import { Deck } from '../components/cards';

type RoomParams = {
  id: string;
}

export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, tasks, lastTask } = useRoom(roomId);

  return (
    <Box h="100vh" >
      <Flex p={4} borderBottom="1px solid gray">
        <Container maxW='container.xl' display="flex" justifyContent="space-between" >
          <Image src={logoImg} maxW="180px" alt="Letmeask" />
          <Flex align="center">
            <RoomCode code={roomId} />
          </Flex>
        </Container >
      </Flex>
      <Container maxW='container.xl' display="flex" flexDir="column"  >
        <Flex my={4} flexDirection="column">
          <Heading fontSize={24} fontWeight="normal" >{title}</Heading>
          {tasks.length > 0 && <Text fontSize={14} color="gray.400" >{tasks.length} Tasks(s)</Text>}
        </Flex>

        <Grid templateColumns='repeat(8, 1fr)' gap={4}>
          <GridItem bg="gray.900" borderRadius={8} p={2} colSpan={3}>
            {lastTask ?
              <>
                <Text fontSize={20} color="gray.200" >
                  {lastTask?.title}
                </Text>
                <Text fontSize={14} color="gray.500" >
                  {lastTask?.content}
                </Text>
                <Flex align="center" mt={8}>
                  <Text textTransform="capitalize" ml={2} fontSize={14} color="gray.500">{lastTask?.author.name}</Text>
                </Flex>
              </>
              : <TasksEmpty />
            }
          </GridItem>
          <GridItem colSpan={5}>
            <UsersInRoom roomId={roomId} votes={lastTask?.votes} />
          </GridItem>
        </Grid>

      </Container>
      {lastTask &&
        <Deck />
      }
    </Box>
  );
}