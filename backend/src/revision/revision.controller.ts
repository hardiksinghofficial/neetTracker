import { Controller, Get } from '@nestjs/common';
import { RevisionService } from './revision.service.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('revision')
@Controller('revision')
export class RevisionController {
  constructor(private readonly revisionService: RevisionService) {}

  @Get('due')
  @ApiOperation({ summary: 'Get due topics' })
  getDueTopics() {
    return this.revisionService.getDueTopics();
  }

  @Get('weak')
  @ApiOperation({ summary: 'Get weak topics' })
  getWeakTopics() {
    return this.revisionService.getWeakTopics();
  }
}
