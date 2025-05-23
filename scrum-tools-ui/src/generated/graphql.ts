import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
};

export type EstimationMember = {
  id: Scalars['ID']['output'];
  joinedAt: Scalars['DateTime']['output'];
  lastSeenAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  secret?: Maybe<Scalars['String']['output']>;
};

export type EstimationSession = {
  activeTopic?: Maybe<EstimationTopic>;
  adminSecret?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  defaultOptions: Array<Scalars['Float']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  joinSecret: Scalars['String']['output'];
  members?: Maybe<Array<EstimationMember>>;
  modifiedAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  topics?: Maybe<Array<EstimationTopic>>;
};


export type EstimationSessionTopicsArgs = {
  limit?: Scalars['Int']['input'];
};

export type EstimationTopic = {
  description: Scalars['String']['output'];
  endedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  options: Array<Scalars['Float']['output']>;
  sessionId: Scalars['String']['output'];
  startedAt: Scalars['DateTime']['output'];
  votes?: Maybe<Array<TopicVote>>;
};

export type Mutation = {
  addVote: TopicVote;
  createSession: EstimationSession;
  createTopic: EstimationTopic;
  endVote: EstimationTopic;
  joinSession: EstimationMember;
  leaveSession: Scalars['Boolean']['output'];
  pingSessionMember: Scalars['Boolean']['output'];
  removeMember: Scalars['Boolean']['output'];
  updateSession: EstimationSession;
};


export type MutationAddVoteArgs = {
  id: Scalars['ID']['input'];
  memberId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
  vote: Scalars['Float']['input'];
};


export type MutationCreateSessionArgs = {
  defaultOptions?: InputMaybe<Array<Scalars['Float']['input']>>;
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateTopicArgs = {
  adminSecret: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationEndVoteArgs = {
  adminSecret: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  topicId: Scalars['String']['input'];
};


export type MutationJoinSessionArgs = {
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationLeaveSessionArgs = {
  id: Scalars['ID']['input'];
  memberId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};


export type MutationPingSessionMemberArgs = {
  id: Scalars['ID']['input'];
  memberId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};


export type MutationRemoveMemberArgs = {
  adminSecret: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  memberId: Scalars['String']['input'];
};


export type MutationUpdateSessionArgs = {
  adminSecret: Scalars['String']['input'];
  defaultOptions?: InputMaybe<Array<Scalars['Float']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  joinSecret?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  estimationSession: EstimationSession;
};


export type QueryEstimationSessionArgs = {
  adminSecret?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
};

export type Subscription = {
  memberAdded: EstimationMember;
  memberRemoved: EstimationMember;
  memberUpdated: EstimationMember;
  sessionUpdated: EstimationSession;
  topicCreated: EstimationTopic;
  voteAdded: TopicVote;
  voteEnded: EstimationTopic;
};


export type SubscriptionMemberAddedArgs = {
  adminSecret?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
};


export type SubscriptionMemberRemovedArgs = {
  adminSecret?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
};


export type SubscriptionMemberUpdatedArgs = {
  adminSecret?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
};


export type SubscriptionSessionUpdatedArgs = {
  adminSecret?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
};


export type SubscriptionTopicCreatedArgs = {
  adminSecret?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
};


export type SubscriptionVoteAddedArgs = {
  adminSecret?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
};


export type SubscriptionVoteEndedArgs = {
  adminSecret?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
};

export type TopicVote = {
  memberId: Scalars['ID']['output'];
  memberName: Scalars['String']['output'];
  vote?: Maybe<Scalars['Float']['output']>;
  votedAt: Scalars['DateTime']['output'];
};

export type CreateSessionMutationVariables = Exact<{
  name: Scalars['String']['input'];
  defaultOptions?: InputMaybe<Array<Scalars['Float']['input']> | Scalars['Float']['input']>;
}>;


export type CreateSessionMutation = { createSession: { id: string, joinSecret: string, adminSecret?: string | null } };

export type JoinSessionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type JoinSessionMutation = { joinSession: { id: string, joinedAt: string, lastSeenAt: string, name: string, secret?: string | null } };

export type UpdateSessionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  adminSecret: Scalars['String']['input'];
  joinSecret?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  defaultOptions?: InputMaybe<Array<Scalars['Float']['input']> | Scalars['Float']['input']>;
}>;


export type UpdateSessionMutation = { updateSession: { id: string, joinSecret: string, adminSecret?: string | null, name: string, description: string, defaultOptions: Array<number> } };

export type LeaveSessionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  memberId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type LeaveSessionMutation = { leaveSession: boolean };

export type PingSessionMemberMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  memberId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
}>;


export type PingSessionMemberMutation = { pingSessionMember: boolean };

export type RemoveMemberMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  memberId: Scalars['String']['input'];
  adminSecret: Scalars['String']['input'];
}>;


export type RemoveMemberMutation = { removeMember: boolean };

export type CreateTopicMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  adminSecret: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateTopicMutation = { createTopic: { id: string, sessionId: string, name: string, options: Array<number> } };

export type AddVoteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  memberId: Scalars['String']['input'];
  secret: Scalars['String']['input'];
  vote: Scalars['Float']['input'];
}>;


export type AddVoteMutation = { addVote: { memberId: string, memberName: string, vote?: number | null, votedAt: string } };

export type EndVoteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  adminSecret: Scalars['String']['input'];
  topicId: Scalars['String']['input'];
}>;


export type EndVoteMutation = { endVote: { id: string, endedAt?: string | null, votes?: Array<{ memberId: string, memberName: string, vote?: number | null, votedAt: string }> | null } };

export type EstimationSessionOverviewQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
  adminSecret?: InputMaybe<Scalars['String']['input']>;
}>;


export type EstimationSessionOverviewQuery = { estimationSession: { id: string, name: string, description: string, joinSecret: string, adminSecret?: string | null, modifiedAt: string, activeTopic?: { id: string } | null, members?: Array<{ id: string }> | null } };

export type EstimationSessionDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
  adminSecret?: InputMaybe<Scalars['String']['input']>;
}>;


export type EstimationSessionDetailsQuery = { estimationSession: { id: string, name: string, description: string, joinSecret: string, adminSecret?: string | null, modifiedAt: string, defaultOptions: Array<number>, activeTopic?: { id: string, description: string, name: string, startedAt: string, endedAt?: string | null, options: Array<number>, votes?: Array<{ memberId: string, memberName: string, vote?: number | null, votedAt: string }> | null } | null, members?: Array<{ id: string, lastSeenAt: string, name: string }> | null, topics?: Array<{ id: string, description: string, name: string, startedAt: string, endedAt?: string | null, options: Array<number>, votes?: Array<{ memberId: string, memberName: string, vote?: number | null, votedAt: string }> | null }> | null } };

export type SessionOverviewFragment = { id: string, name: string, description: string, joinSecret: string, adminSecret?: string | null, modifiedAt: string, activeTopic?: { id: string } | null, members?: Array<{ id: string }> | null };

export type SessionDetailsFragment = { id: string, name: string, description: string, joinSecret: string, adminSecret?: string | null, modifiedAt: string, defaultOptions: Array<number>, activeTopic?: { id: string, description: string, name: string, startedAt: string, endedAt?: string | null, options: Array<number>, votes?: Array<{ memberId: string, memberName: string, vote?: number | null, votedAt: string }> | null } | null, members?: Array<{ id: string, lastSeenAt: string, name: string }> | null, topics?: Array<{ id: string, description: string, name: string, startedAt: string, endedAt?: string | null, options: Array<number>, votes?: Array<{ memberId: string, memberName: string, vote?: number | null, votedAt: string }> | null }> | null };

export type SessionMemberFragment = { id: string, lastSeenAt: string, name: string };

export type TopicDetailsFragment = { id: string, description: string, name: string, startedAt: string, endedAt?: string | null, options: Array<number>, votes?: Array<{ memberId: string, memberName: string, vote?: number | null, votedAt: string }> | null };

export type TopicVoteDetailsFragment = { memberId: string, memberName: string, vote?: number | null, votedAt: string };

export type SessionUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
  adminSecret?: InputMaybe<Scalars['String']['input']>;
}>;


export type SessionUpdatedSubscription = { sessionUpdated: { id: string, name: string, description: string, joinSecret: string, adminSecret?: string | null, modifiedAt: string, activeTopic?: { id: string } | null, members?: Array<{ id: string, lastSeenAt: string, name: string }> | null, topics?: Array<{ id: string, description: string, name: string, startedAt: string, endedAt?: string | null, options: Array<number>, votes?: Array<{ memberId: string, memberName: string, vote?: number | null, votedAt: string }> | null }> | null } };

export type MemberAddedSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
}>;


export type MemberAddedSubscription = { memberAdded: { id: string, lastSeenAt: string, name: string } };

export type MemberUpdatedSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
}>;


export type MemberUpdatedSubscription = { memberUpdated: { id: string, lastSeenAt: string, name: string } };

export type MemberRemovedSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
}>;


export type MemberRemovedSubscription = { memberRemoved: { id: string, lastSeenAt: string, name: string } };

export type TopicCreatedSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
}>;


export type TopicCreatedSubscription = { topicCreated: { id: string, description: string, name: string, startedAt: string, endedAt?: string | null, options: Array<number>, votes?: Array<{ memberId: string, memberName: string, vote?: number | null, votedAt: string }> | null } };

export type VoteAddedSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
}>;


export type VoteAddedSubscription = { voteAdded: { memberId: string, memberName: string, vote?: number | null, votedAt: string } };

export type VoteEndedSubscriptionVariables = Exact<{
  id: Scalars['ID']['input'];
  joinSecret: Scalars['String']['input'];
}>;


export type VoteEndedSubscription = { voteEnded: { id: string, description: string, name: string, startedAt: string, endedAt?: string | null, options: Array<number>, votes?: Array<{ memberId: string, memberName: string, vote?: number | null, votedAt: string }> | null } };

export const SessionOverviewFragmentDoc = gql`
    fragment SessionOverview on EstimationSession {
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
    `;
export const TopicVoteDetailsFragmentDoc = gql`
    fragment TopicVoteDetails on TopicVote {
  memberId
  memberName
  vote
  votedAt
}
    `;
export const TopicDetailsFragmentDoc = gql`
    fragment TopicDetails on EstimationTopic {
  id
  description
  name
  startedAt
  endedAt
  options
  votes {
    ...TopicVoteDetails
  }
}
    ${TopicVoteDetailsFragmentDoc}`;
export const SessionMemberFragmentDoc = gql`
    fragment SessionMember on EstimationMember {
  id
  lastSeenAt
  name
}
    `;
export const SessionDetailsFragmentDoc = gql`
    fragment SessionDetails on EstimationSession {
  id
  name
  description
  joinSecret
  adminSecret
  modifiedAt
  defaultOptions
  activeTopic {
    ...TopicDetails
  }
  members {
    ...SessionMember
  }
  topics(limit: 1) {
    ...TopicDetails
  }
}
    ${TopicDetailsFragmentDoc}
${SessionMemberFragmentDoc}`;
export const CreateSessionDocument = gql`
    mutation createSession($name: String!, $defaultOptions: [Float!]) {
  createSession(name: $name, description: "", defaultOptions: $defaultOptions) {
    id
    joinSecret
    adminSecret
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateSessionGQL extends Apollo.Mutation<CreateSessionMutation, CreateSessionMutationVariables> {
    document = CreateSessionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
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
    providedIn: 'root'
  })
  export class JoinSessionGQL extends Apollo.Mutation<JoinSessionMutation, JoinSessionMutationVariables> {
    document = JoinSessionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateSessionDocument = gql`
    mutation updateSession($id: ID!, $adminSecret: String!, $joinSecret: String, $name: String, $description: String, $defaultOptions: [Float!]) {
  updateSession(
    id: $id
    adminSecret: $adminSecret
    joinSecret: $joinSecret
    name: $name
    description: $description
    defaultOptions: $defaultOptions
  ) {
    id
    joinSecret
    adminSecret
    name
    description
    defaultOptions
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateSessionGQL extends Apollo.Mutation<UpdateSessionMutation, UpdateSessionMutationVariables> {
    document = UpdateSessionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LeaveSessionDocument = gql`
    mutation leaveSession($id: ID!, $memberId: String!, $secret: String!) {
  leaveSession(id: $id, memberId: $memberId, secret: $secret)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LeaveSessionGQL extends Apollo.Mutation<LeaveSessionMutation, LeaveSessionMutationVariables> {
    document = LeaveSessionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PingSessionMemberDocument = gql`
    mutation pingSessionMember($id: ID!, $memberId: String!, $secret: String!) {
  pingSessionMember(id: $id, memberId: $memberId, secret: $secret)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PingSessionMemberGQL extends Apollo.Mutation<PingSessionMemberMutation, PingSessionMemberMutationVariables> {
    document = PingSessionMemberDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveMemberDocument = gql`
    mutation removeMember($id: ID!, $memberId: String!, $adminSecret: String!) {
  removeMember(id: $id, memberId: $memberId, adminSecret: $adminSecret)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveMemberGQL extends Apollo.Mutation<RemoveMemberMutation, RemoveMemberMutationVariables> {
    document = RemoveMemberDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateTopicDocument = gql`
    mutation createTopic($id: ID!, $adminSecret: String!, $name: String!, $description: String) {
  createTopic(
    id: $id
    adminSecret: $adminSecret
    name: $name
    description: $description
  ) {
    id
    sessionId
    name
    options
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateTopicGQL extends Apollo.Mutation<CreateTopicMutation, CreateTopicMutationVariables> {
    document = CreateTopicDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddVoteDocument = gql`
    mutation addVote($id: ID!, $memberId: String!, $secret: String!, $vote: Float!) {
  addVote(id: $id, memberId: $memberId, secret: $secret, vote: $vote) {
    memberId
    memberName
    vote
    votedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddVoteGQL extends Apollo.Mutation<AddVoteMutation, AddVoteMutationVariables> {
    document = AddVoteDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EndVoteDocument = gql`
    mutation endVote($id: ID!, $adminSecret: String!, $topicId: String!) {
  endVote(id: $id, adminSecret: $adminSecret, topicId: $topicId) {
    id
    endedAt
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
    providedIn: 'root'
  })
  export class EndVoteGQL extends Apollo.Mutation<EndVoteMutation, EndVoteMutationVariables> {
    document = EndVoteDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EstimationSessionOverviewDocument = gql`
    query estimationSessionOverview($id: ID!, $joinSecret: String!, $adminSecret: String) {
  estimationSession(id: $id, joinSecret: $joinSecret, adminSecret: $adminSecret) {
    ...SessionOverview
  }
}
    ${SessionOverviewFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class EstimationSessionOverviewGQL extends Apollo.Query<EstimationSessionOverviewQuery, EstimationSessionOverviewQueryVariables> {
    document = EstimationSessionOverviewDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EstimationSessionDetailsDocument = gql`
    query estimationSessionDetails($id: ID!, $joinSecret: String!, $adminSecret: String) {
  estimationSession(id: $id, joinSecret: $joinSecret, adminSecret: $adminSecret) {
    ...SessionDetails
  }
}
    ${SessionDetailsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class EstimationSessionDetailsGQL extends Apollo.Query<EstimationSessionDetailsQuery, EstimationSessionDetailsQueryVariables> {
    document = EstimationSessionDetailsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
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
      ...SessionMember
    }
    topics(limit: 1) {
      ...TopicDetails
    }
  }
}
    ${SessionMemberFragmentDoc}
${TopicDetailsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class SessionUpdatedGQL extends Apollo.Subscription<SessionUpdatedSubscription, SessionUpdatedSubscriptionVariables> {
    document = SessionUpdatedDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MemberAddedDocument = gql`
    subscription memberAdded($id: ID!, $joinSecret: String!) {
  memberAdded(id: $id, joinSecret: $joinSecret) {
    ...SessionMember
  }
}
    ${SessionMemberFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class MemberAddedGQL extends Apollo.Subscription<MemberAddedSubscription, MemberAddedSubscriptionVariables> {
    document = MemberAddedDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MemberUpdatedDocument = gql`
    subscription memberUpdated($id: ID!, $joinSecret: String!) {
  memberUpdated(id: $id, joinSecret: $joinSecret) {
    ...SessionMember
  }
}
    ${SessionMemberFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class MemberUpdatedGQL extends Apollo.Subscription<MemberUpdatedSubscription, MemberUpdatedSubscriptionVariables> {
    document = MemberUpdatedDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MemberRemovedDocument = gql`
    subscription memberRemoved($id: ID!, $joinSecret: String!) {
  memberRemoved(id: $id, joinSecret: $joinSecret) {
    ...SessionMember
  }
}
    ${SessionMemberFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class MemberRemovedGQL extends Apollo.Subscription<MemberRemovedSubscription, MemberRemovedSubscriptionVariables> {
    document = MemberRemovedDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const TopicCreatedDocument = gql`
    subscription topicCreated($id: ID!, $joinSecret: String!) {
  topicCreated(id: $id, joinSecret: $joinSecret) {
    ...TopicDetails
  }
}
    ${TopicDetailsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class TopicCreatedGQL extends Apollo.Subscription<TopicCreatedSubscription, TopicCreatedSubscriptionVariables> {
    document = TopicCreatedDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const VoteAddedDocument = gql`
    subscription voteAdded($id: ID!, $joinSecret: String!) {
  voteAdded(id: $id, joinSecret: $joinSecret) {
    ...TopicVoteDetails
  }
}
    ${TopicVoteDetailsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class VoteAddedGQL extends Apollo.Subscription<VoteAddedSubscription, VoteAddedSubscriptionVariables> {
    document = VoteAddedDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const VoteEndedDocument = gql`
    subscription voteEnded($id: ID!, $joinSecret: String!) {
  voteEnded(id: $id, joinSecret: $joinSecret) {
    ...TopicDetails
  }
}
    ${TopicDetailsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class VoteEndedGQL extends Apollo.Subscription<VoteEndedSubscription, VoteEndedSubscriptionVariables> {
    document = VoteEndedDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }