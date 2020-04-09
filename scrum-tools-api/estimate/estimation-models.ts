export interface EstimationSession {
  id: string;
  name: string;
  description: string;

  joinSecret: string;
  adminSecret: string;

  createdAt: string;
  modifiedAt: string;

  defaultOptions: number[];
}

export interface EstimationMember {
  id: string;
  name: string;
  joinedAt: string;
  lastSeenAt: string;
}

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
