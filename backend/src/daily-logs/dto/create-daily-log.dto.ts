import { IsNumber, IsOptional, IsString, IsDateString, IsArray, IsBoolean } from 'class-validator';
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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  checkInTime?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  checkInTimestamp?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  checkOutTime?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  checkOutTimestamp?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isOnBreak?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  currentBreakStartTime?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  totalBreakSeconds?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  totalDurationHours?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mood?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reflection?: string;
}

export class AddTopicsDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  topicIds: number[];
}
