import { useEffect, useState } from 'react';
import '../styles/question.scss';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';

import { useAuth, useRoom } from 'main/hooks';
import { Avatar, Box, Button, Heading, Text, Flex, Image } from '@chakra-ui/react';
import { database } from 'data/services';
import { Task } from 'domain/entities';


type LastTaskProps = {
  roomId: string
}

export function LastTask({ roomId, }: LastTaskProps) {
  const { user } = useAuth();
  const { tasks } = useRoom(roomId);

  const [lastTask, setLastTask] = useState<Task>({} as Task);
  useEffect(() => {
    var last = tasks.pop();
    if (last) {
      setLastTask(last);
    }
  }, [tasks]);

  async function handleDeleteQuestion(taskId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/tasks/${taskId}`).remove();
    }
  }


  async function handleLikeQuestion(taskId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(`rooms/${roomId}/tasks/${taskId}/vote/${likeId}`).remove();
    } else {
      await database.ref(`rooms/${roomId}/tasks/${taskId}/vote`).push({
        authorId: user?.id,
      });
    }
  }

  async function handleHighlightQuestion(taskId: string) {
    await database.ref(`rooms/${roomId}/tasks/${taskId}`).update({
      isHighlighted: true,
    });
  }


  return (
    <Box
      mb={16}
      bg={lastTask.isHighlighted ? "red" : "gray.800"}
      p={4}
      borderRadius={8}
    >
      <Heading>{lastTask.content}</Heading>
      <Text>{lastTask.content}</Text>
      <Flex mt={4} justify="space-between" align="center">
        <Flex justify="space-between" align="center">
          <Avatar src={lastTask.author?.avatar} name={lastTask.author?.name} size="sm" alt={lastTask.author?.name} />
          <Text ml={2}>{lastTask.author?.name}</Text>
        </Flex>
        <Flex  justify="space-between" align="center">
          <Button
            type="button"
            bg="none"
            onClick={() => handleHighlightQuestion(lastTask.id)}
          >
            <Image src={checkImg} alt="Mostrar" />
          </Button>
          <Button
            type="button"
            bg="none"
            onClick={() => handleDeleteQuestion(lastTask.id)}
          >
            <Image src={deleteImg} alt="Remover pergunta" />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}