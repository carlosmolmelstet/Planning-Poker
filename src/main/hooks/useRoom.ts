import { useEffect, useState } from "react";
import { database } from "data/services/firebase";
import { useAuth } from "./useAuth";
import { Task } from "domain/entities";

type FirebaseTasks = Record<string, {
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  vote: Record<string, {
    authorId: string;
  }>;
}>

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  const [title, setTitle] = useState('');
  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseTasks: FirebaseTasks = databaseRoom.tasks ?? {};

      const parsedTasks = Object.entries(firebaseTasks).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          voteCount: Object.values(value.vote ?? {}).length,
          voteId: Object.entries(value.vote ?? {}).find(([key, vote]) => vote.authorId === user?.id)?.[0],
        }
      });

      setTasks(parsedTasks);
      setTitle(databaseRoom.title);

    })

    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id]);





  return {title, tasks};
}