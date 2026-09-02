import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TopicStatus } from '@prisma/client';

export class UpdateTopicDto {
  @ApiPropertyOptional({ enum: TopicStatus })
  @IsEnum(TopicStatus)
  @IsOptional()
  status?: TopicStatus;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  confidenceRating?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  lastStudiedDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  lastRevisedDate?: string;
}
