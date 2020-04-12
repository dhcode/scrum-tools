import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: Date;
};

export type EstimationMember = {
  id: Scalars['ID'];
  name: Scalars['String'];
  joinedAt: Scalars['DateTime'];
  lastSeenAt: Scalars['DateTime'];
  secret?: Maybe<Scalars['String']>;
};

export type EstimationSession = {
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  modifiedAt: Scalars['DateTime'];
  defaultOptions: Array<Scalars['Int']>;
  activeTopic?: Maybe<EstimationTopic>;
  topics?: Maybe<Array<EstimationTopic>>;
  members?: Maybe<Array<EstimationMember>>;
};

export type EstimationSessionTopicsArgs = {
  limit?: Maybe<Scalars['Int']>;
};

export type EstimationTopic = {
  id: Scalars['ID'];
  sessionId: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  options: Array<Scalars['Int']>;
  startedAt: Scalars['DateTime'];
  endedAt: Scalars['DateTime'];
  votes?: Maybe<Array<TopicVote>>;
};

export type Mutation = {
  createSession: EstimationSession;
  updateSession: EstimationSession;
  joinSession: EstimationMember;
  leaveSession: Scalars['Boolean'];
};

export type MutationCreateSessionArgs = {
  name: Scalars['String'];
  description: Scalars['String'];
  defaultOptions?: Maybe<Array<Scalars['Int']>>;
};

export type MutationUpdateSessionArgs = {
  id: Scalars['ID'];
  adminSecret: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  joinSecret?: Maybe<Scalars['String']>;
  defaultOptions?: Maybe<Array<Scalars['Int']>>;
};

export type MutationJoinSessionArgs = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  name: Scalars['String'];
};

export type MutationLeaveSessionArgs = {
  id: Scalars['ID'];
  memberId: Scalars['String'];
  secret: Scalars['String'];
};

export type Query = {
  estimationSession: EstimationSession;
};

export type QueryEstimationSessionArgs = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type Subscription = {
  sessionUpdated: EstimationSession;
  memberUpdated: EstimationMember;
  memberAdded: EstimationMember;
  memberRemoved: EstimationMember;
  topicCreated: EstimationTopic;
  voteAdded: VoteAddedInfo;
  voteEnded: VoteEndedInfo;
};

export type SubscriptionSessionUpdatedArgs = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type SubscriptionMemberUpdatedArgs = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type SubscriptionMemberAddedArgs = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type SubscriptionMemberRemovedArgs = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type SubscriptionTopicCreatedArgs = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type SubscriptionVoteAddedArgs = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type SubscriptionVoteEndedArgs = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type TopicVote = {
  memberId: Scalars['ID'];
  memberName: Scalars['String'];
  votedAt: Scalars['DateTime'];
  vote?: Maybe<Scalars['Int']>;
};

export type VoteAddedInfo = {
  votedAt: Scalars['DateTime'];
  member: EstimationMember;
};

export type VoteEndedInfo = {
  topic: EstimationTopic;
  votes: Array<TopicVote>;
};

export type CreateSessionMutationVariables = {
  name: Scalars['String'];
};

export type CreateSessionMutation = { createSession: Pick<EstimationSession, 'id' | 'joinSecret' | 'adminSecret'> };

export type JoinSessionMutationVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  name: Scalars['String'];
};

export type JoinSessionMutation = {
  joinSession: Pick<EstimationMember, 'id' | 'joinedAt' | 'lastSeenAt' | 'name' | 'secret'>;
};

export type EstimationSessionOverviewQueryVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type EstimationSessionOverviewQuery = {
  estimationSession: Pick<
    EstimationSession,
    'id' | 'name' | 'description' | 'joinSecret' | 'adminSecret' | 'modifiedAt'
  > & { activeTopic?: Maybe<Pick<EstimationTopic, 'id'>>; members?: Maybe<Array<Pick<EstimationMember, 'id'>>> };
};

export type EstimationSessionDetailsQueryVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type EstimationSessionDetailsQuery = {
  estimationSession: Pick<
    EstimationSession,
    'id' | 'name' | 'description' | 'joinSecret' | 'adminSecret' | 'modifiedAt'
  > & {
    activeTopic?: Maybe<
      Pick<EstimationTopic, 'id' | 'description' | 'name' | 'startedAt' | 'endedAt' | 'options'> & {
        votes?: Maybe<Array<Pick<TopicVote, 'memberId' | 'memberName' | 'vote' | 'votedAt'>>>;
      }
    >;
    members?: Maybe<Array<Pick<EstimationMember, 'id' | 'lastSeenAt' | 'name'>>>;
    topics?: Maybe<
      Array<
        Pick<EstimationTopic, 'id' | 'description' | 'name' | 'startedAt' | 'endedAt'> & {
          votes?: Maybe<Array<Pick<TopicVote, 'memberName' | 'vote'>>>;
        }
      >
    >;
  };
};

export type SessionUpdatedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type SessionUpdatedSubscription = {
  sessionUpdated: Pick<
    EstimationSession,
    'id' | 'name' | 'description' | 'joinSecret' | 'adminSecret' | 'modifiedAt'
  > & {
    activeTopic?: Maybe<Pick<EstimationTopic, 'id'>>;
    members?: Maybe<Array<Pick<EstimationMember, 'id' | 'name' | 'lastSeenAt'>>>;
  };
};

export type MemberAddedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
};

export type MemberAddedSubscription = { memberAdded: Pick<EstimationMember, 'id' | 'lastSeenAt' | 'name'> };

export type MemberUpdatedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
};

export type MemberUpdatedSubscription = { memberUpdated: Pick<EstimationMember, 'id' | 'lastSeenAt' | 'name'> };

export type MemberRemovedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
};

export type MemberRemovedSubscription = { memberRemoved: Pick<EstimationMember, 'id' | 'lastSeenAt' | 'name'> };

export type TopicCreatedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
};

export type TopicCreatedSubscription = {
  topicCreated: Pick<EstimationTopic, 'id' | 'name' | 'description' | 'startedAt' | 'endedAt' | 'options'> & {
    votes?: Maybe<Array<Pick<TopicVote, 'memberId' | 'memberName' | 'vote' | 'votedAt'>>>;
  };
};

export type VoteAddedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
};

export type VoteAddedSubscription = {
  voteAdded: Pick<VoteAddedInfo, 'votedAt'> & { member: Pick<EstimationMember, 'id'> };
};

export type VoteEndedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
};

export type VoteEndedSubscription = {
  voteEnded: {
    topic: Pick<EstimationTopic, 'id' | 'endedAt'>;
    votes: Array<Pick<TopicVote, 'memberId' | 'memberName' | 'vote' | 'votedAt'>>;
  };
};

export const CreateSessionDocument = gql`
  mutation createSession($name: String!) {
    createSession(name: $name, description: "") {
      id
      joinSecret
      adminSecret
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateSessionGQL extends Apollo.Mutation<CreateSessionMutation, CreateSessionMutationVariables> {
  document = CreateSessionDocument;
}
export const JoinSessionDocument = gql`
  mutation joinSession($id: ID!, $joinSecret: String!, $name: String!) {
    joinSession(id: $id, joinSecret: $joinSecret, name: $name) {
      id
      joinedAt
      lastSeenAt
      name
      secret
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class JoinSessionGQL extends Apollo.Mutation<JoinSessionMutation, JoinSessionMutationVariables> {
  document = JoinSessionDocument;
}
export const EstimationSessionOverviewDocument = gql`
  query estimationSessionOverview($id: ID!, $joinSecret: String!, $adminSecret: String) {
    estimationSession(id: $id, joinSecret: $joinSecret, adminSecret: $adminSecret) {
      id
      name
      description
      joinSecret
      adminSecret
      modifiedAt
      activeTopic {
        id
      }
      members {
        id
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class EstimationSessionOverviewGQL extends Apollo.Query<
  EstimationSessionOverviewQuery,
  EstimationSessionOverviewQueryVariables
> {
  document = EstimationSessionOverviewDocument;
}
export const EstimationSessionDetailsDocument = gql`
  query estimationSessionDetails($id: ID!, $joinSecret: String!, $adminSecret: String) {
    estimationSession(id: $id, joinSecret: $joinSecret, adminSecret: $adminSecret) {
      id
      name
      description
      joinSecret
      adminSecret
      modifiedAt
      activeTopic {
        id
        description
        name
        startedAt
        endedAt
        options
        votes {
          memberId
          memberName
          vote
          votedAt
        }
      }
      members {
        id
        lastSeenAt
        name
      }
      topics(limit: 10) {
        id
        description
        name
        startedAt
        endedAt
        votes {
          memberName
          vote
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class EstimationSessionDetailsGQL extends Apollo.Query<
  EstimationSessionDetailsQuery,
  EstimationSessionDetailsQueryVariables
> {
  document = EstimationSessionDetailsDocument;
}
export const SessionUpdatedDocument = gql`
  subscription sessionUpdated($id: ID!, $joinSecret: String!, $adminSecret: String) {
    sessionUpdated(id: $id, joinSecret: $joinSecret, adminSecret: $adminSecret) {
      id
      name
      description
      joinSecret
      adminSecret
      modifiedAt
      activeTopic {
        id
      }
      members {
        id
        name
        lastSeenAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SessionUpdatedGQL extends Apollo.Subscription<
  SessionUpdatedSubscription,
  SessionUpdatedSubscriptionVariables
> {
  document = SessionUpdatedDocument;
}
export const MemberAddedDocument = gql`
  subscription memberAdded($id: ID!, $joinSecret: String!) {
    memberAdded(id: $id, joinSecret: $joinSecret) {
      id
      lastSeenAt
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class MemberAddedGQL extends Apollo.Subscription<MemberAddedSubscription, MemberAddedSubscriptionVariables> {
  document = MemberAddedDocument;
}
export const MemberUpdatedDocument = gql`
  subscription memberUpdated($id: ID!, $joinSecret: String!) {
    memberUpdated(id: $id, joinSecret: $joinSecret) {
      id
      lastSeenAt
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class MemberUpdatedGQL extends Apollo.Subscription<
  MemberUpdatedSubscription,
  MemberUpdatedSubscriptionVariables
> {
  document = MemberUpdatedDocument;
}
export const MemberRemovedDocument = gql`
  subscription memberRemoved($id: ID!, $joinSecret: String!) {
    memberRemoved(id: $id, joinSecret: $joinSecret) {
      id
      lastSeenAt
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class MemberRemovedGQL extends Apollo.Subscription<
  MemberRemovedSubscription,
  MemberRemovedSubscriptionVariables
> {
  document = MemberRemovedDocument;
}
export const TopicCreatedDocument = gql`
  subscription topicCreated($id: ID!, $joinSecret: String!) {
    topicCreated(id: $id, joinSecret: $joinSecret) {
      id
      name
      description
      startedAt
      endedAt
      options
      votes {
        memberId
        memberName
        vote
        votedAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class TopicCreatedGQL extends Apollo.Subscription<TopicCreatedSubscription, TopicCreatedSubscriptionVariables> {
  document = TopicCreatedDocument;
}
export const VoteAddedDocument = gql`
  subscription voteAdded($id: ID!, $joinSecret: String!) {
    voteAdded(id: $id, joinSecret: $joinSecret) {
      member {
        id
      }
      votedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class VoteAddedGQL extends Apollo.Subscription<VoteAddedSubscription, VoteAddedSubscriptionVariables> {
  document = VoteAddedDocument;
}
export const VoteEndedDocument = gql`
  subscription voteEnded($id: ID!, $joinSecret: String!) {
    voteEnded(id: $id, joinSecret: $joinSecret) {
      topic {
        id
        endedAt
      }
      votes {
        memberId
        memberName
        vote
        votedAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class VoteEndedGQL extends Apollo.Subscription<VoteEndedSubscription, VoteEndedSubscriptionVariables> {
  document = VoteEndedDocument;
}
