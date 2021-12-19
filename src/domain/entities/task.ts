import { Vote } from ".";

export type Task = {
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    title: string;
    hiddenVotes: boolean;
    votes: Vote[]
  }
  