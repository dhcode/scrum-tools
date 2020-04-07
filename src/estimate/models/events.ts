import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class StartEstimationDto {
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  joinSecret?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  adminSecret?: string;
}
