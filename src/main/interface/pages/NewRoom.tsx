import { Link, useHistory } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { auth } from "data/services";
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoImgLight from '../assets/images/logo-light.svg';
import { database } from 'data/services/firebase';
import { useAuth } from 'main/hooks/useAuth';
import { Flex, Image, Text, Box, useColorMode, useBreakpointValue, Button, Input, FormControl, Link as ChakraLink } from '@chakra-ui/react';

export function NewRoom() {
  const { colorMode } = useColorMode();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {

      if (user) {
        const { email } = user;

        if (!email) {
          throw new Error('Missing information from Google Account.');
        }
      }
    });

    return () => {
      unsubscribe();
    }
  }, []);

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
      usersInRoom: [
        {
          id: user?.id,
          name: user?.name,
          avater: user?.avatar
        }
      ],
    });

    history.push(`/admin/rooms/${firebaseRoom.key}`);
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
          <Text fontSize={useBreakpointValue({ base: 14, xl: 16 })} mb={2} >Criar uma nova sala</Text>
          <FormControl display="flex" justifyContent="center" alignItems="center" flexDir="column" as="form" onSubmit={handleCreateRoom}>
            <Input
              type="text"
              placeholder="Nome da sala"
              maxW="300px"
              mb={4}
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button
              bgGradient={colorMode == "dark" ? 'linear(to-l, brand.500, green.400)' : "linear(to-l, brand.500, brand.500)"}
              color="white"
              type="submit" w="300px"
              _hover={{
                bgGradient: colorMode == "dark" ? 'linear(to-l, green.400, brand.500)' : 'linear(to-l, brand.600, brand.600)'
              }}
            >
              Criar sala
            </Button>
          </FormControl>
          <Text fontSize={useBreakpointValue({ base: 12, xl: 14 })} mt={2}>
            Quer entrar em uma sala existente? <Link to="/"><ChakraLink color="brand.500">Clique aqui</ChakraLink></Link>
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}