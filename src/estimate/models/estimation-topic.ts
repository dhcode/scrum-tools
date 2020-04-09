export interface EstimationTopic {
  id: string;
  sessionId: string;
  name: string;
  description: string;

  options: number[];

  startedAt: string;
  endedAt: string;
}

export interface TopicVote {
  memberId: string;
  memberName: string;
  votedAt: string;
  vote: number;
}
