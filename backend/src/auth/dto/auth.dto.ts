import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCodeDto {
  @ApiProperty()
  @IsString()
  code: string;
}
