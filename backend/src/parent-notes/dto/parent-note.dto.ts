import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParentNoteDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty()
  @IsString()
  message: string;
}
