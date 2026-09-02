import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePomodoroDto {
  @ApiProperty()
  @IsNumber()
  dailyLogId: number;

  @ApiProperty()
  @IsNumber()
  workDurationMinutes: number;

  @ApiProperty()
  @IsNumber()
  breakDurationMinutes: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  distractionsLogged?: number;
}
