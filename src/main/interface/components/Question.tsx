import { Avatar, Box, Button, Heading, Text, Flex } from '@chakra-ui/react';

type QuestionProps = {
  content: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  isLastQuestion?: boolean;
  toTurnVotes?: () => void;
  hiddeVotes?: boolean;
}

export function Question({
  content,
  title,
  author,
  isLastQuestion = false,
  hiddeVotes = false,
  toTurnVotes
}: QuestionProps) {
  return (
    <Box
      mb={4}
      bg="gray.900"
      p={4}
      borderRadius={8}
    >
      <Heading>{title}</Heading>
      <Text>{content}</Text>
      <Flex mt={4} justify="space-between" align="center">
        <Flex justify="space-between" align="center">
          <Avatar src={author.avatar} size="sm" name={author.name} alt={author.name} />
          <Text ml={2}>{author.name}</Text>
        </Flex>
        {isLastQuestion &&
          <Button
            bgGradient='linear(to-r, brand.500, green.500)'
            _hover={{bgGradient: 'linear(to-r, brand.500, green.500)' }}
            onClick={toTurnVotes}>
            {hiddeVotes ? "Mostrar votos" : "Esconder votos"}
          </Button>
        }
      </Flex>
    </Box>
  );
}