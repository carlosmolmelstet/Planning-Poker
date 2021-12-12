import { FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import emptyImg from '../assets/images/empty-questions.svg';

import { RoomCode, Question, PokerTable, LastTask } from '../components/';
import { useAuth } from 'main/hooks/useAuth';
import { useRoom } from 'main/hooks/useRoom';
import deleteImg from '../assets/images/delete.svg';
import { database } from 'data/services/firebase';
import { Flex, Container, Image, Button, Box, Heading, Text, Textarea, FormControl, Input } from '@chakra-ui/react';

type RoomParams = {
  id: string;
}

export function RoomOwner() {
  const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const [newTaskContent, setNewTaskContent] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const roomId = params.id;
  const { title, tasks } = useRoom(roomId);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();
    if (newTaskContent.trim() === '' || newTaskTitle.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const task = {
      content: newTaskContent,
      title: newTaskTitle,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/tasks`).push(task);

    setNewTaskContent('');
    setNewTaskTitle('');
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(`rooms/${roomId}/tasks/${questionId}/likes/${likeId}`).remove();
    } else {
      await database.ref(`rooms/${roomId}/tasks/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/tasks/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que você deseja encerrar esta sala?')) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      });
    }

    history.push('/');
  }





  return (
    <Box>
      <Flex p={4} borderBottom="1px solid gray">
        <Container maxW='container.xl' display="flex" justifyContent="space-between" >
          <Image src={logoImg} maxW="180px" alt="Letmeask" />
          <Flex align="center">
            <RoomCode code={roomId} />
            <Button ml={4} onClick={handleEndRoom}>Encerrar sala</Button>
          </Flex>
        </Container >
      </Flex>

      <Container maxW='container.xl' display="flex" flexDir="column"  >
        <Flex my={4} flexDirection="column">
          <Heading fontSize={24} fontWeight="normal" >{title}</Heading>
          {tasks.length > 0 && <Text fontSize={14} color="gray.400" >{tasks.length} Tasks(s)</Text>}
        </Flex>

        <FormControl mb={16} as="form" onSubmit={handleSendQuestion}>
          <Input
            placeholder="Titulo da Task"
            onChange={event => setNewTaskTitle(event.target.value)}
            value={newTaskTitle}
          />
          <Textarea
            my={4}
            placeholder="O que você quer perguntar?"
            onChange={event => setNewTaskContent(event.target.value)}
            value={newTaskContent}
          />
          <Button type="submit" disabled={!user}>Adicionar Task</Button>
        </FormControl>
        {tasks.length > 0 ? <LastTask roomId={roomId} /> : <></>}
        <Text mb={4}>Historico</Text>
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
              <p>Faça o seu login e seja a primeira pessoa a fazer uma pergunta!</p>
            </div>
          )
        }
      </Container>
    </Box>
  );
}