export interface EstimationSession {
  _id: string;
  name: string;
  description: string;

  joinSecret: string;
  adminSecret: string;

  createdAt: Date;
  modifiedAt: Date;
  expiresAt: Date;

  defaultOptions: number[];

  members: EstimationMember[];
}

export interface EstimationMember {
  id: string;
  name: string;
  joinedAt: Date;
  lastSeenAt: Date;
}
