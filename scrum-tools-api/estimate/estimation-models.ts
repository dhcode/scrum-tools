import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EstimationMember {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  joinedAt: string;

  @Field()
  lastSeenAt: string;
}

@ObjectType()
export class TopicVote {
  @Field()
  memberId: string;

  @Field()
  memberName: string;

  @Field()
  votedAt: string;

  @Field(() => Int, { nullable: true })
  vote?: number;
}

@ObjectType()
export class EstimationTopic {
  @Field()
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
  startedAt: string;

  @Field()
  endedAt: string;

  @Field(() => [TopicVote], { nullable: true })
  votes?: TopicVote[];
}

@ObjectType()
export class EstimationSession {
  @Field()
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
  createdAt: string;

  @Field()
  modifiedAt: string;

  @Field(() => [Int])
  defaultOptions: number[];

  @Field(() => EstimationTopic, { nullable: true })
  activeTopic?: EstimationTopic;

  @Field(() => [EstimationTopic], { nullable: true })
  topics?: EstimationTopic[];

  @Field(() => [EstimationMember], { nullable: true })
  members?: EstimationMember[];
}
