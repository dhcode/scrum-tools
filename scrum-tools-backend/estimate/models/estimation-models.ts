import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EstimationMember {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  joinedAt: Date;

  @Field()
  lastSeenAt: Date;

  @Field({ nullable: true })
  secret?: string;
}

@ObjectType()
export class TopicVote {
  @Field(() => ID)
  memberId: string;

  @Field()
  memberName: string;

  @Field()
  votedAt: Date;

  @Field(() => Int, { nullable: true })
  vote?: number;
}

@ObjectType()
export class EstimationTopic {
  @Field(() => ID)
  id: string;

  @Field()
  sessionId: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [Int])
  options: number[];

  @Field()
  startedAt: Date;

  @Field()
  endedAt: Date;

  @Field(() => [TopicVote], { nullable: true })
  votes?: TopicVote[];
}

@ObjectType()
export class EstimationSession {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  joinSecret: string;

  @Field({ nullable: true })
  adminSecret: string;

  @Field()
  createdAt: Date;

  @Field()
  modifiedAt: Date;

  @Field(() => [Int])
  defaultOptions: number[];

  @Field(() => EstimationTopic, { nullable: true })
  activeTopic?: EstimationTopic;

  @Field(() => [EstimationTopic], { nullable: true })
  topics?: EstimationTopic[];

  @Field(() => [EstimationMember], { nullable: true })
  members?: EstimationMember[];
}

@ObjectType()
export class VoteAddedInfo {
  @Field()
  votedAt: Date;

  @Field(() => EstimationMember)
  member: EstimationMember;
}

@ObjectType()
export class VoteEndedInfo {
  @Field(() => EstimationMember)
  topic: EstimationTopic;

  @Field(() => [TopicVote])
  votes: TopicVote[];
}
