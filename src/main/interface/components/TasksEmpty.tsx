import { Flex,Image ,Text } from "@chakra-ui/react";
import emptyImg from '../assets/images/empty-questions.svg';

export function TasksEmpty() {
    return (
        <Flex direction="column" align="center" p={10}>
            <Image maxW="100px" src={emptyImg} alt="Ilustração simbolizando perguntas" />
            <Text >Nenhuma Task por aqui...</Text>
            <Text fontSize={14} color="gray.300">Adicione tasks para votar com a sua equipe!</Text>
        </Flex>
    );
}