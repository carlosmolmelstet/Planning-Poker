import { Button, Flex, Image, Text } from '@chakra-ui/react';
import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
  code: string;
}

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
  }

  return (
    <Button
      background="gray.700"
      borderRadius={4}
      _hover={{background: "green.500"}}
      p={0}
      h={8}
      onClick={copyRoomCodeToClipboard}
    >
      <Flex borderRadius={4} justify="center" align="center" w={8} h={8} >
        <Image src={copyImg} alt="Copiar código da sala" />
      </Flex>
      <Flex h={8} background="gray.900" align="center" >
        <Text fontWeight="medium" fontSize={14} px={4}>Sala #{props.code}</Text>
      </Flex>
    </Button>
  );
}