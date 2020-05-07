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
  DateTime: string;
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
  endedAt?: Maybe<Scalars['DateTime']>;
  votes?: Maybe<Array<TopicVote>>;
};

export type Mutation = {
  createSession: EstimationSession;
  updateSession: EstimationSession;
  joinSession: EstimationMember;
  leaveSession: Scalars['Boolean'];
  pingSessionMember: Scalars['Boolean'];
  removeMember: Scalars['Boolean'];
  createTopic: EstimationTopic;
  endVote: EstimationTopic;
  addVote: TopicVote;
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

export type MutationPingSessionMemberArgs = {
  id: Scalars['ID'];
  memberId: Scalars['String'];
  secret: Scalars['String'];
};

export type MutationRemoveMemberArgs = {
  id: Scalars['ID'];
  memberId: Scalars['String'];
  adminSecret: Scalars['String'];
};

export type MutationCreateTopicArgs = {
  id: Scalars['ID'];
  adminSecret: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type MutationEndVoteArgs = {
  id: Scalars['ID'];
  adminSecret: Scalars['String'];
  topicId: Scalars['String'];
};

export type MutationAddVoteArgs = {
  id: Scalars['ID'];
  memberId: Scalars['String'];
  secret: Scalars['String'];
  vote: Scalars['Int'];
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
  voteAdded: TopicVote;
  voteEnded: EstimationTopic;
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

export type UpdateSessionMutationVariables = {
  id: Scalars['ID'];
  adminSecret: Scalars['String'];
  joinSecret?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  defaultOptions?: Maybe<Array<Scalars['Int']>>;
};

export type UpdateSessionMutation = {
  updateSession: Pick<
    EstimationSession,
    'id' | 'joinSecret' | 'adminSecret' | 'name' | 'description' | 'defaultOptions'
  >;
};

export type LeaveSessionMutationVariables = {
  id: Scalars['ID'];
  memberId: Scalars['String'];
  secret: Scalars['String'];
};

export type LeaveSessionMutation = Pick<Mutation, 'leaveSession'>;

export type PingSessionMemberMutationVariables = {
  id: Scalars['ID'];
  memberId: Scalars['String'];
  secret: Scalars['String'];
};

export type PingSessionMemberMutation = Pick<Mutation, 'pingSessionMember'>;

export type RemoveMemberMutationVariables = {
  id: Scalars['ID'];
  memberId: Scalars['String'];
  adminSecret: Scalars['String'];
};

export type RemoveMemberMutation = Pick<Mutation, 'removeMember'>;

export type CreateTopicMutationVariables = {
  id: Scalars['ID'];
  adminSecret: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type CreateTopicMutation = { createTopic: Pick<EstimationTopic, 'id' | 'sessionId' | 'name' | 'options'> };

export type AddVoteMutationVariables = {
  id: Scalars['ID'];
  memberId: Scalars['String'];
  secret: Scalars['String'];
  vote: Scalars['Int'];
};

export type AddVoteMutation = { addVote: Pick<TopicVote, 'memberId' | 'memberName' | 'vote' | 'votedAt'> };

export type EndVoteMutationVariables = {
  id: Scalars['ID'];
  adminSecret: Scalars['String'];
  topicId: Scalars['String'];
};

export type EndVoteMutation = {
  endVote: Pick<EstimationTopic, 'id' | 'endedAt'> & {
    votes?: Maybe<Array<Pick<TopicVote, 'memberId' | 'memberName' | 'vote' | 'votedAt'>>>;
  };
};

export type EstimationSessionOverviewQueryVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type EstimationSessionOverviewQuery = { estimationSession: SessionOverviewFragment };

export type EstimationSessionDetailsQueryVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
  adminSecret?: Maybe<Scalars['String']>;
};

export type EstimationSessionDetailsQuery = { estimationSession: SessionDetailsFragment };

export type SessionOverviewFragment = Pick<
  EstimationSession,
  'id' | 'name' | 'description' | 'joinSecret' | 'adminSecret' | 'modifiedAt'
> & { activeTopic?: Maybe<Pick<EstimationTopic, 'id'>>; members?: Maybe<Array<Pick<EstimationMember, 'id'>>> };

export type SessionDetailsFragment = Pick<
  EstimationSession,
  'id' | 'name' | 'description' | 'joinSecret' | 'adminSecret' | 'modifiedAt' | 'defaultOptions'
> & {
  activeTopic?: Maybe<TopicDetailsFragment>;
  members?: Maybe<Array<SessionMemberFragment>>;
  topics?: Maybe<Array<TopicDetailsFragment>>;
};

export type SessionMemberFragment = Pick<EstimationMember, 'id' | 'lastSeenAt' | 'name'>;

export type TopicDetailsFragment = Pick<
  EstimationTopic,
  'id' | 'description' | 'name' | 'startedAt' | 'endedAt' | 'options'
> & { votes?: Maybe<Array<TopicVoteDetailsFragment>> };

export type TopicVoteDetailsFragment = Pick<TopicVote, 'memberId' | 'memberName' | 'vote' | 'votedAt'>;

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
    members?: Maybe<Array<SessionMemberFragment>>;
    topics?: Maybe<Array<TopicDetailsFragment>>;
  };
};

export type MemberAddedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
};

export type MemberAddedSubscription = { memberAdded: SessionMemberFragment };

export type MemberUpdatedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
};

export type MemberUpdatedSubscription = { memberUpdated: SessionMemberFragment };

export type MemberRemovedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
};

export type MemberRemovedSubscription = { memberRemoved: SessionMemberFragment };

export type TopicCreatedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
};

export type TopicCreatedSubscription = { topicCreated: TopicDetailsFragment };

export type VoteAddedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
};

export type VoteAddedSubscription = { voteAdded: TopicVoteDetailsFragment };

export type VoteEndedSubscriptionVariables = {
  id: Scalars['ID'];
  joinSecret: Scalars['String'];
};

export type VoteEndedSubscription = { voteEnded: TopicDetailsFragment };

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
  ${TopicVoteDetailsFragmentDoc}
`;
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
  ${SessionMemberFragmentDoc}
`;
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
export const UpdateSessionDocument = gql`
  mutation updateSession(
    $id: ID!
    $adminSecret: String!
    $joinSecret: String
    $name: String
    $description: String
    $defaultOptions: [Int!]
  ) {
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
  providedIn: 'root',
})
export class UpdateSessionGQL extends Apollo.Mutation<UpdateSessionMutation, UpdateSessionMutationVariables> {
  document = UpdateSessionDocument;
}
export const LeaveSessionDocument = gql`
  mutation leaveSession($id: ID!, $memberId: String!, $secret: String!) {
    leaveSession(id: $id, memberId: $memberId, secret: $secret)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LeaveSessionGQL extends Apollo.Mutation<LeaveSessionMutation, LeaveSessionMutationVariables> {
  document = LeaveSessionDocument;
}
export const PingSessionMemberDocument = gql`
  mutation pingSessionMember($id: ID!, $memberId: String!, $secret: String!) {
    pingSessionMember(id: $id, memberId: $memberId, secret: $secret)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PingSessionMemberGQL extends Apollo.Mutation<
  PingSessionMemberMutation,
  PingSessionMemberMutationVariables
> {
  document = PingSessionMemberDocument;
}
export const RemoveMemberDocument = gql`
  mutation removeMember($id: ID!, $memberId: String!, $adminSecret: String!) {
    removeMember(id: $id, memberId: $memberId, adminSecret: $adminSecret)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RemoveMemberGQL extends Apollo.Mutation<RemoveMemberMutation, RemoveMemberMutationVariables> {
  document = RemoveMemberDocument;
}
export const CreateTopicDocument = gql`
  mutation createTopic($id: ID!, $adminSecret: String!, $name: String!, $description: String) {
    createTopic(id: $id, adminSecret: $adminSecret, name: $name, description: $description) {
      id
      sessionId
      name
      options
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateTopicGQL extends Apollo.Mutation<CreateTopicMutation, CreateTopicMutationVariables> {
  document = CreateTopicDocument;
}
export const AddVoteDocument = gql`
  mutation addVote($id: ID!, $memberId: String!, $secret: String!, $vote: Int!) {
    addVote(id: $id, memberId: $memberId, secret: $secret, vote: $vote) {
      memberId
      memberName
      vote
      votedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AddVoteGQL extends Apollo.Mutation<AddVoteMutation, AddVoteMutationVariables> {
  document = AddVoteDocument;
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
  providedIn: 'root',
})
export class EndVoteGQL extends Apollo.Mutation<EndVoteMutation, EndVoteMutationVariables> {
  document = EndVoteDocument;
}
export const EstimationSessionOverviewDocument = gql`
  query estimationSessionOverview($id: ID!, $joinSecret: String!, $adminSecret: String) {
    estimationSession(id: $id, joinSecret: $joinSecret, adminSecret: $adminSecret) {
      ...SessionOverview
    }
  }
  ${SessionOverviewFragmentDoc}
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
      ...SessionDetails
    }
  }
  ${SessionDetailsFragmentDoc}
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
        ...SessionMember
      }
      topics(limit: 1) {
        ...TopicDetails
      }
    }
  }
  ${SessionMemberFragmentDoc}
  ${TopicDetailsFragmentDoc}
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
      ...SessionMember
    }
  }
  ${SessionMemberFragmentDoc}
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
      ...SessionMember
    }
  }
  ${SessionMemberFragmentDoc}
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
      ...SessionMember
    }
  }
  ${SessionMemberFragmentDoc}
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
      ...TopicDetails
    }
  }
  ${TopicDetailsFragmentDoc}
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
      ...TopicVoteDetails
    }
  }
  ${TopicVoteDetailsFragmentDoc}
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
      ...TopicDetails
    }
  }
  ${TopicDetailsFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class VoteEndedGQL extends Apollo.Subscription<VoteEndedSubscription, VoteEndedSubscriptionVariables> {
  document = VoteEndedDocument;
}
