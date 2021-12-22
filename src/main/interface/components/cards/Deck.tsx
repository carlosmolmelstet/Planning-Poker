import { HStack } from "@chakra-ui/react";
import { database } from "data/services";
import { FirebaseVotes, Vote } from "domain/entities";
import { useAuth, useRoom } from "main/hooks";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from ".";

const effortList = ["1","2","3","5","8","13","?",]

type RoomParams = {
    id: string;
}
export function Deck() {
    const [vote, setVote] = useState("");
    const params = useParams<RoomParams>();
    const { user, signInWithGoogle } = useAuth();
    const [votes, setVotes] = useState<Vote[]>([]);
    const roomId = params.id;
    const { lastTask } = useRoom(roomId);

    async function handleVote(effort?: string) {
        if (!user) {
            await signInWithGoogle();
        };

        if (roomId.trim() === '') {
            return;
        }

        const taskRef = await database.ref(`rooms/${roomId}/tasks/${lastTask?.id}`).get();

        taskRef.ref.on('value', room => {
            const databaseRoom = room.val();
            const firebaseVotes: FirebaseVotes = databaseRoom.votes ?? {};

            const parsedVotes = Object.entries(firebaseVotes).map(([key, value]) => {
                return {
                    id: key,
                    user: value.user,
                    effort: value.effort
                }
            });

            setVotes(parsedVotes);
        })

        var voteId = votes.find(vote => vote.user.id == user?.id)?.id;
        if (user) {
            if (!effort && voteId) {
                removeVote(voteId)
                setVote("");
                return;
            }

            if (effort && voteId) {
                updateVote(voteId);
                setVote(effort);
                return;
            }

            if (!voteId && effort) {
                addVote();
                setVote(effort);
                return;
            }
        }

        function addVote() {
            if (user) {
                database.ref(`rooms/${roomId}/tasks/${lastTask?.id}/votes`).push({
                    user: user,
                    effort: effort
                });
            }
        }

        function updateVote(voteId: string) {
            database.ref(`rooms/${roomId}/tasks/${lastTask?.id}/votes/${voteId}`).update({
                user: user,
                effort: effort
            });
        }

        function removeVote(voteId: string) {
            database.ref(`rooms/${roomId}/tasks/${lastTask?.id}/votes/${voteId}`).remove();
        }
    }

    return (
        <HStack h="170px" w="100%" justify="center" spacing={4} position="absolute" bottom="0">
            {effortList.map(item => <Card key={item} effort={item} vote={vote} setVote={handleVote}/>)}
        </HStack>
    );
}