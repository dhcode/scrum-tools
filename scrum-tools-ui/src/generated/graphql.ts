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
  members: Array<TopicVote>;
};

export type Mutation = {
  createSession: EstimationSession;
  joinSession: EstimationMember;
};

export type MutationCreateSessionArgs = {
  name: Scalars['String'];
  description: Scalars['String'];
  defaultOptions?: Maybe<Scalars['Int']>;
};

export type MutationJoinSessionArgs = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  name: Scalars['String'];
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
  memberUpdated: EstimationMember;
  memberAdded: EstimationMember;
  memberRemoved: EstimationMember;
  topicCreated: EstimationTopic;
  voteAdded: VoteAddedInfo;
  voteEnded: VoteEndedInfo;
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
  topic: EstimationMember;
  votes: Array<TopicVote>;
};

export type CreateSessionMutationVariables = {
  name: Scalars['String'];
};

export type CreateSessionMutation = { createSession: Pick<EstimationSession, 'id' | 'joinSecret' | 'adminSecret'> };

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

export type JoinSessionMutationVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  name: Scalars['String'];
};

export type JoinSessionMutation = { joinSession: Pick<EstimationMember, 'id' | 'joinedAt' | 'lastSeenAt' | 'name'> };

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
export const JoinSessionDocument = gql`
  mutation joinSession($id: ID!, $joinSecret: String!, $name: String!) {
    joinSession(id: $id, joinSecret: $joinSecret, name: $name) {
      id
      joinedAt
      lastSeenAt
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class JoinSessionGQL extends Apollo.Mutation<JoinSessionMutation, JoinSessionMutationVariables> {
  document = JoinSessionDocument;
}
