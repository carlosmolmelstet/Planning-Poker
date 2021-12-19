import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import emptyImg from '../assets/images/empty-questions.svg';

import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth, useRoom } from 'main/hooks/';
import { database } from 'data/services';

import { Box, Button, Container, Flex, Grid, GridItem, Heading, HStack, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { UsersInRoom } from '../components';
import { FirebaseVotes, Vote } from 'domain/entities';
import { useEffect, useState } from 'react';

type RoomParams = {
  id: string;
}



export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { user, signInWithGoogle } = useAuth();
  const { title, tasks, lastTask } = useRoom(roomId);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [myVote, setMyVote] = useState("");

  useEffect(() => {
    if (user) {
      setMyVote(lastTask && lastTask.votes.find(vote => vote.user.id == user.id)?.effort || "")
    }
  }, [lastTask]);

  async function vote(taskId: string, effort?: string) {

    if (!user) {
      await signInWithGoogle();
    };

    if (roomId.trim() === '') {
      return;
    }

    const taskRef = await database.ref(`rooms/${roomId}/tasks/${taskId}`).get();

    taskRef.ref.on('value', room => {
      const databaseRoom = room.val();
      const firebaseVotes: FirebaseVotes = databaseRoom.votes ?? {};

      const parsedVotes = Object.entries(firebaseVotes).map(([key, value]) => {
        return {
          id: key,
          user: value.user,
          effort: value.effort
        }
      });

      setVotes(parsedVotes);
    })

    var voteId = votes.find(vote => vote.user.id == user?.id)?.id;
    if (user) {
      if (!effort && voteId) {
        removeVote(voteId)
        return;
      }

      if (effort && voteId) {
        updateVote(voteId);
        return;
      }

      if (!voteId && effort) {
        addVote();
        return;
      }
    }

    function addVote() {
      if (user) {
        database.ref(`rooms/${roomId}/tasks/${taskId}/votes`).push({
          user: user,
          effort: effort
        });
      }
    }

    function updateVote(voteId: string) {
      database.ref(`rooms/${roomId}/tasks/${taskId}/votes/${voteId}`).update({
        user: user,
        effort: effort
      });
    }

    function removeVote(voteId: string) {
      database.ref(`rooms/${roomId}/tasks/${taskId}/votes/${voteId}`).remove();
    }
  }


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
            <Text fontSize={20} color="gray.200" >
              {lastTask?.title}
            </Text>
            <Text fontSize={14} color="gray.500" >
              {lastTask?.content}
            </Text>
            <Flex align="center" mt={8}>
              <Text textTransform="capitalize" ml={2} fontSize={14} color="gray.500">{lastTask?.author.name}</Text>
            </Flex>
          </GridItem>
          <GridItem colSpan={5}>
            <UsersInRoom roomId={roomId} votes={lastTask?.votes} />
          </GridItem>
        </Grid>


        {/* {lastTask &&
          <Button onClick={() => vote(lastTask.id, "10")}
          >Votar</Button>
        }
        {lastTask &&
          <Button onClick={() => vote(lastTask.id, "16")}
          >Votar</Button>
        }
        {lastTask &&
          <Button onClick={() => vote(lastTask.id)}
          >remove</Button>
        } */}
      </Container>
      {lastTask &&
        <HStack h="220px" w="100%" justify="center" spacing={4} position="absolute" bottom="0">
          <Box alignSelf={myVote == "1" ? "center" : "flex-end"} bg="gray.900" onClick={() => vote(lastTask.id, "1")} h="200px" w={40} borderRadius={8} _hover={{alignSelf: "center"}}>1</Box>
          <Box alignSelf={myVote == "2" ? "center" : "flex-end"} bg="gray.900" onClick={() => vote(lastTask.id, "2")} h="200px" w={40} borderRadius={8} _hover={{alignSelf: "center"}}>2</Box>
          <Box alignSelf={myVote == "3" ? "center" : "flex-end"} bg="gray.900" onClick={() => vote(lastTask.id, "3")} h="200px" w={40} borderRadius={8} _hover={{alignSelf: "center"}}>3</Box>
          <Box alignSelf={myVote == "5" ? "center" : "flex-end"} bg="gray.900" onClick={() => vote(lastTask.id, "5")} h="200px" w={40} borderRadius={8} _hover={{alignSelf: "center"}}>5</Box>
          <Box alignSelf={myVote == "8" ? "center" : "flex-end"} bg="gray.900" onClick={() => vote(lastTask.id, "8")} h="200px" w={40} borderRadius={8} _hover={{alignSelf: "center"}}>8</Box>
          <Box alignSelf={myVote == "13" ? "center" : "flex-end"} bg="gray.900" onClick={() => vote(lastTask.id, "13")} h="200px" w={40} borderRadius={8} _hover={{alignSelf: "center"}}>13</Box>
        </HStack>
      }
    </Box>
  );
}