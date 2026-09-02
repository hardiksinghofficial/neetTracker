import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthCodeDto } from './dto/auth.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  @ApiOperation({ summary: 'Verify access code' })
  verify(@Body() dto: AuthCodeDto) {
    return this.authService.verify(dto.code);
  }

  @Post('setup')
  @ApiOperation({ summary: 'Setup access code' })
  setup(@Body() dto: AuthCodeDto) {
    return this.authService.setup(dto.code);
  }
}
