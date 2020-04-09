import { ArrayNotEmpty, ArrayUnique, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { IsEstimationOption } from './options-validator';

export class CreateSessionDto {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(4000)
  description: string;

  @Validate(IsEstimationOption)
  @ArrayUnique()
  @ArrayNotEmpty()
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
