import { Avatar, Box, Button, Heading, Text, Flex, Image } from '@chakra-ui/react';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
}

export function Question({
  content,
  author,
}: QuestionProps) {
  return (
    <Box
      mb={4}
      bg="gray.800"
      p={4}
      borderRadius={8}
    >
      <Heading>{content}</Heading>
      <Text>{content}</Text>
      <Flex mt={4} justify="space-between" align="center">
        <Flex justify="space-between" align="center">
          <Avatar src={author.avatar} size="sm" name={author.name} alt={author.name} />
          <Text ml={2}>{author.name}</Text>
        </Flex>
      </Flex>
    </Box>
  );
}