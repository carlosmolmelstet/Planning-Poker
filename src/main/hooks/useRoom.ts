import { useEffect, useState } from "react";
import { database } from "data/services/firebase";
import { useAuth } from "./useAuth";
import { FirebaseTasks, FirebaseUsers, Task, User, Vote } from "domain/entities";

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [lastTask, setLastTask] = useState<Task>();

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
          title: value.title,
          author: value.author,
          hiddenVotes: value.hiddenVotes,
          votes: Object.entries(value.votes || []).map(([key, value]) => { return {id: key, user: value.user, effort: value.effort}}) 
        }
      });

      
      const firebaseUsers: FirebaseUsers = databaseRoom.usersInRoom ?? {};

      const parsedUsers = Object.entries(firebaseUsers).map(([key, value]) => {
        return {
          id: value.id,
          name: value.name,
          avatar: value.avatar
        }
      });

      setUsers(parsedUsers);
      setTasks(parsedTasks);
      setLastTask(parsedTasks.pop());
      setTitle(databaseRoom.title);
    })

    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id]);

  return {title, tasks, lastTask, users};
}