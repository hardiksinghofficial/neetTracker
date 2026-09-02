import { IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TestType } from '@prisma/client';

export class CreateTestDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty({ enum: TestType })
  @IsEnum(TestType)
  testType: TestType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  subjectScopeId?: number;

  @ApiProperty()
  @IsNumber()
  totalQuestions: number;

  @ApiProperty()
  @IsNumber()
  correctAnswers: number;

  @ApiProperty()
  @IsNumber()
  wrongAnswers: number;

  @ApiProperty()
  @IsNumber()
  unattempted: number;

  @ApiProperty()
  @IsNumber()
  timeTakenMinutes: number;
}
