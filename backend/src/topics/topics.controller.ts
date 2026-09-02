import { Controller, Get, Patch, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { TopicsService } from './topics.service.js';
import { UpdateTopicDto } from './dto/update-topic.dto.js';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all topics' })
  @ApiQuery({ name: 'chapterId', required: false, type: Number })
  findAll(@Query('chapterId') chapterId?: string) {
    return this.topicsService.findAll(chapterId ? +chapterId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one topic' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update topic' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(id, updateTopicDto);
  }
}
