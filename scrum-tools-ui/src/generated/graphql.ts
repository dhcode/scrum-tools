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

export type EstimationSessionQueryVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type EstimationSessionQuery = {
  estimationSession: Pick<
    EstimationSession,
    'id' | 'description' | 'joinSecret' | 'modifiedAt' | 'createdAt' | 'defaultOptions'
  > & { activeTopic?: Maybe<Pick<EstimationTopic, 'id' | 'name' | 'description' | 'options'>> };
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
export const EstimationSessionDocument = gql`
  query estimationSession($id: ID!, $joinSecret: String!, $adminSecret: String) {
    estimationSession(id: $id, joinSecret: $joinSecret, adminSecret: $adminSecret) {
      id
      description
      joinSecret
      modifiedAt
      createdAt
      defaultOptions
      activeTopic {
        id
        name
        description
        options
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class EstimationSessionGQL extends Apollo.Query<EstimationSessionQuery, EstimationSessionQueryVariables> {
  document = EstimationSessionDocument;
}
