import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty()
  @IsNumber()
  subjectId: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  classLevel: number;

  @ApiProperty()
  @IsNumber()
  weightage: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isHighYield?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subGroup?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isRevised?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
