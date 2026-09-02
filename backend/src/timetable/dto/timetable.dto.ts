import { IsNumber, IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { DayOfWeek } from '@prisma/client';

export class CreateTimetableDto {
  @ApiProperty({ enum: DayOfWeek })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty()
  @IsNumber()
  subjectId: number;

  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsString()
  endTime: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  recurring?: boolean;
}

export class UpdateTimetableDto extends PartialType(CreateTimetableDto) {}
