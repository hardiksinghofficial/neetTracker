import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParentNoteDto {
  @ApiProperty()
  @IsString()
  message: string;
}
