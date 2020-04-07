export interface EstimationTopic {
  _id: string;
  sessionId: string;
  name: string;
  description: string;

  options: number[];

  startedAt: Date;
  endedAt: Date;

  votes: TopicVote[];
}

export interface TopicVote {
  memberId: string;
  memberName: string;
  votedAt: Date;
  vote: number;
}
