export type Task = {
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    voteCount: number;
    voteId: string | undefined;
  }
  