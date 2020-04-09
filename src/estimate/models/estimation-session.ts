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
