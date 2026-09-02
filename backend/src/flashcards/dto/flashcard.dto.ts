import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFlashcardDto {
  @ApiProperty()
  @IsNumber()
  topicId: number;

  @ApiProperty()
  @IsString()
  frontContent: string;

  @ApiProperty()
  @IsString()
  backContent: string;
}

export class ReviewFlashcardDto {
  @ApiProperty()
  @IsNumber()
  quality: number; // 0-5
}
