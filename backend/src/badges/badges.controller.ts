import { Controller, Get } from '@nestjs/common';
import { BadgesService } from './badges.service.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('badges')
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all badges' })
  findAll() {
    return this.badgesService.findAll();
  }
}
