import {
  ArrayNotEmpty,
  ArrayUnique,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ArgsType, Field, Float, ID } from '@nestjs/graphql';

@ArgsType()
export class CreateSessionArgs {
  @Field()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @MaxLength(4000)
  description: string;

  @Field(() => [Float], { nullable: true })
  @IsOptional()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  defaultOptions: number[];
}

@ArgsType()
export class UpdateSessionArgs {
  @Field(() => ID)
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  id: string;

  @Field({ description: 'To verify access to the session.' })
  @IsString()
  @MaxLength(16)
  @IsNotEmpty()
  adminSecret: string;

  @Field({ nullable: true, description: 'Provided to modify the name' })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  name?: string;

  @Field({ nullable: true, description: 'Provided to modify the description' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @Field({ nullable: true, description: 'Provided to modify the join secret' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  joinSecret?: string;

  @Field(() => [Float], { nullable: true, description: 'Provided to modify the default options' })
  @IsOptional()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  defaultOptions?: number[];
}

@ArgsType()
export class GetSessionArgs {
  @Field(() => ID)
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @MaxLength(20)
  joinSecret: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  adminSecret?: string;
}

@ArgsType()
export class JoinSessionArgs {
  @Field(() => ID)
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @MaxLength(20)
  joinSecret: string;

  @Field({ description: 'Display name of the member who joins.' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;
}

@ArgsType()
export class LeaveSessionArgs {
  @Field(() => ID)
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  memberId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  secret: string;
}

@ArgsType()
export class PingMemberArgs {
  @Field(() => ID)
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  memberId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  secret: string;
}

@ArgsType()
export class RemoveMemberArgs {
  @Field(() => ID)
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  memberId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  adminSecret: string;
}

@ArgsType()
export class CreateTopicArgs {
  @Field(() => ID)
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @MaxLength(16)
  adminSecret: string;

  @Field()
  @IsString()
  @MaxLength(100)
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description: string;
}

@ArgsType()
export class EndVoteArgs {
  @Field(() => ID)
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @MaxLength(16)
  adminSecret: string;

  @Field()
  @IsString()
  @MaxLength(10)
  topicId: string;
}

@ArgsType()
export class AddVoteArgs {
  @Field(() => ID)
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  memberId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  secret: string;

  @Field(() => Float)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  vote: number;
}
