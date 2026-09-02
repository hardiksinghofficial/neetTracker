import { IsNumber, IsOptional, IsString, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDailyLogDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  hoursStudied?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  checkInPhoto?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class AddTopicsDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  topicIds: number[];
}
