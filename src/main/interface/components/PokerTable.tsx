import { Box } from "@chakra-ui/react";
import { Task } from "domain/entities";
import { useRoom } from "main/hooks";
import { useEffect, useState } from "react";

interface PokerTableProps {
    roomId: string
}

export function PokerTable({ roomId }: PokerTableProps) {
    const { tasks } = useRoom(roomId);
    const [lastTask, setLastTask] = useState<Task>({} as Task);
    useEffect(() => {
        var last = tasks.pop();
        if (last) {
            console.log(last);
            setLastTask(last);
        }
    }, [tasks]);

    return (
        <Box bg={lastTask.isHighlighted ? "red" : "gray.800"}        >
            {lastTask.content}
        </Box>
    );
}