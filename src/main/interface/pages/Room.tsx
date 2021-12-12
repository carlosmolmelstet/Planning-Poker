import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import emptyImg from '../assets/images/empty-questions.svg';

import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth, useRoom } from 'main/hooks/';
import { database } from 'data/services';

import { Box, Button, Container, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { PokerTable } from '../components/PokerTable';
import { useEffect, useState } from 'react';

type RoomParams = {
  id: string;
}


type User = {
  id: string;
  name: string;
}

type FirebaseUser = Record<string, User>

export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { user } = useAuth();
  const { title, tasks } = useRoom(roomId);

  // async function handleCheckQuestionAsAnswered(questionId: string) {
  //   await database.ref(`rooms/${roomId}/tasks/${questionId}`).update({
  //     isAnswered: true,
  //   });
  // }

  // async function handleHighlightQuestion(questionId: string) {
  //   await database.ref(`rooms/${roomId}/tasks/${questionId}`).update({
  //     isHighlighted: true,
  //   });
  // }

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseUsers: FirebaseUser = databaseRoom.users ?? {};

      const parsedUsers = Object.entries(firebaseUsers).map(([key, value]) => {
        return {
          id: value.id,
          name: value.name,
        }
      });
      setUsers(parsedUsers);
    })

  }, []);


  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(`rooms/${roomId}/tasks/${questionId}/likes/${likeId}`).remove();
    } else {
      await database.ref(`rooms/${roomId}/tasks/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  }

  return (
    <Box>
      <Flex p={4} borderBottom="1px solid gray">
        <Container maxW='container.xl' display="flex" justifyContent="space-between" >
          <Image src={logoImg} maxW="180px" alt="Letmeask" />
          <Flex align="center">
            <RoomCode code={roomId} />
          </Flex>
        </Container >
      </Flex>

      {users.map(user => (<div>{user.name}</div>))}

      <Container maxW='container.xl' display="flex" flexDir="column"  >
        <Flex my={4} flexDirection="column">
          <Heading fontSize={24} fontWeight="normal" >{title}</Heading>
          {tasks.length > 0 && <Text fontSize={14} color="gray.400" >{tasks.length} Tasks(s)</Text>}
        </Flex>

        <PokerTable roomId={roomId} />

        {tasks.length > 0
          ? (
            <div className="question-list">
              {tasks.map(question => {
                return (
                  <Question
                    key={question.id}
                    content={question.content}
                    author={question.author}
                  />
                );
              })}
            </div>
          )
          : (
            <div className="empty-tasks">
              <img src={emptyImg} alt="Ilustração simbolizando perguntas" />
              <h2>Nenhuma pergunta por aqui...</h2>
              <p>Envie o código desta sala para seus amigos e comece a responder perguntas!</p>
            </div>
          )
        }
      </Container>
    </Box>
  );
}