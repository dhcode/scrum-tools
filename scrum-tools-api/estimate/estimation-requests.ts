import {
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ArgsType, Field, Int } from '@nestjs/graphql';

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

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  defaultOptions: number[];
}

export class JoinSessionDto {
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @MaxLength(20)
  joinSecret: string;
}

export class GetActiveTopicDto {
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  sessionId: string;
}
