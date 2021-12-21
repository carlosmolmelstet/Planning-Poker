import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoImgLight from '../assets/images/logo-light.svg';
import googleIconImg from '../assets/images/google-icon.svg'
import logInImg from '../assets/images/log-in.svg';
import { database } from 'data/services/firebase';
import { useAuth } from 'main/hooks';
import { Box, Flex, Image, Text, FormControl, Button, Input, useColorMode, useBreakpointValue } from '@chakra-ui/react';
import { FirebaseUsers, User } from 'domain/entities';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  const { colorMode } = useColorMode();

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    };

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (!user) {
      await signInWithGoogle();
    };

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('A sala não existe');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('A sala já foi fechada');
      return;
    }

    roomRef.ref.on('value', room => {
      const databaseRoom = room.val();
      const firebaseTasks: FirebaseUsers = databaseRoom.usersInRoom ?? {};

      const parsedTasks = Object.entries(firebaseTasks).map(([key, value]) => {
        return {
          id: value.id,
          name: value.name,
          avatar: value.avatar
        }
      });

      var exist = parsedTasks.some(esxitUser => esxitUser.id == user?.id);
      if (!exist && user) {
        var users = [...parsedTasks, user]
        addUser(roomCode, users);
      }
    })

    function addUser(roomCode: string, users: User[]) {
      database.ref(`rooms/${roomCode}`).update({
        usersInRoom: users,
      });
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <Flex >
      <Flex justify="center" display={useBreakpointValue({ base: "none", md: "flex" })} align="center" direction="column" w="50%" h="100vh" as="aside" background={colorMode == "dark" ? "gray.800" : "brand.500"}>
        <Image src={illustrationImg} width="40%" alt="Ilustração simbolizando perguntas e respostas" />
        <Box>
          <Text fontSize={useBreakpointValue({ base: 24, xl: 36 })} fontWeight={700}>Crie suas plannings</Text>
          <Text fontSize={useBreakpointValue({ base: 16, xl: 24 })} >Vote as tasks com seu time em tempo real</Text>
        </Box>
      </Flex>
      <Flex w={useBreakpointValue({ base: "100%", md: "50%" })} h="100vh" justify="center" align="center" >
        <Flex justify="center" maxW="500px" width="100%" align="center" direction="column">
          <Image mb={10} src={colorMode == "dark" ? logoImg : logoImgLight} alt="letmeask" />
          <Button px={6} py={6} onClick={handleCreateRoom} colorScheme={colorMode == "dark" ? "gray" : "red"}>
            <Image mr={2} width={4} src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </Button>
          <Text
            fontSize={14}
            my={4}
            textAlign="center"
            color="gray.400">
            ou entre em uma sala
          </Text>
          <FormControl display="flex" justifyContent="center" alignItems="center" flexDir="column" as="form" onSubmit={handleJoinRoom}>
            <Input
              type="text"
              maxW="300px"
              mb={4}
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button
              bgGradient={colorMode == "dark" ? 'linear(to-l, brand.500, green.400)' : "linear(to-l, brand.500, brand.500)"}
              color="white"
              type="submit" w="300px"
              _hover={{
                bgGradient: colorMode == "dark" ? 'linear(to-l, green.400, brand.500)' : 'linear(to-l, brand.600, brand.600)'
              }}
            >
              <Image mr={2} src={logInImg} alt="Ícone de entrar" />
              Entrar na sala
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </Flex>
  )
}