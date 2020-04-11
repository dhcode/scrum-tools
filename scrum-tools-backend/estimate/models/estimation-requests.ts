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
import { ArgsType, Field, ID, Int } from '@nestjs/graphql';

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