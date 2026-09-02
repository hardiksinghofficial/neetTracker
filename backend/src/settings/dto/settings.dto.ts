import { IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  neetExamDate?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  pomodoroDefaultWorkMinutes?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  pomodoroDefaultBreakMinutes?: number;
}
