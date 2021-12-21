import { FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';

import { RoomCode, Question, TasksEmpty } from '../components/';
import { useAuth } from 'main/hooks/useAuth';
import { useRoom } from 'main/hooks/useRoom';
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
  const { title, tasks, lastTask } = useRoom(roomId);

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
      hiddenVotes: true,
      author: {
        name: user.name,
        avatar: user.avatar
      },
    };

    await database.ref(`rooms/${roomId}/tasks`).push(task);

    setNewTaskContent('');
    setNewTaskTitle('');
  }

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que você deseja encerrar esta sala?')) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      });
    }

    history.push('/');
  }

  async function toTurnVotes() {
    if (lastTask) {
      database.ref(`rooms/${roomId}/tasks/${lastTask.id}`).update({
        hiddenVotes: !lastTask.hiddenVotes,
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
            <Button ml={4} onClick={handleEndRoom}>Encerrar sala</Button>
          </Flex>
        </Container >
      </Flex>
      <Container maxW='container.xl' display="flex" flexDir="column"  >
        <Flex my={4} flexDirection="column">
          <Heading fontSize={24} fontWeight="normal" >{title}</Heading>
          {tasks.length > 0 && <Text fontSize={14} color="gray.400" >{tasks.length + 1} Tasks(s)</Text>}
        </Flex>
        <FormControl mb={16} as="form" onSubmit={handleSendQuestion}>
          <Input
            placeholder="Titulo da Task"
            onChange={event => setNewTaskTitle(event.target.value)}
            value={newTaskTitle}
          />
          <Textarea
            my={4}
            placeholder="Descreva a task"
            onChange={event => setNewTaskContent(event.target.value)}
            value={newTaskContent}
          />
          <Button type="submit" disabled={!user}>Adicionar Task</Button>
        </FormControl>

        {lastTask && <Question
          key={lastTask.id}
          content={lastTask.content}
          title={lastTask.title}
          author={lastTask.author}
          isLastQuestion={true}
          toTurnVotes={toTurnVotes}
          hiddeVotes={lastTask.hiddenVotes}
        />}

        {tasks.length > 0
          ? (
            <>
              <Text mb={4} mt={10}>Historico</Text>
              <Flex direction="column-reverse" >
                {tasks.map(question => {
                  return (
                    <Question
                      key={question.id}
                      content={question.content}
                      title={question.title}
                      author={question.author}
                    />
                  );
                })}
              </Flex>
            </>
          )
          : (
            <TasksEmpty />
          )
        }

      </Container>
    </Box>
  );
}