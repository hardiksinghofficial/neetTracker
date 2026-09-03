import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DailyLogsService } from './daily-logs.service.js';
import { CreateDailyLogDto, AddTopicsDto } from './dto/create-daily-log.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('daily-logs')
@Controller('daily-logs')
export class DailyLogsController {
  constructor(private readonly dailyLogsService: DailyLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all daily logs' })
  findAll() {
    return this.dailyLogsService.findAll();
  }

  @Get('heatmap')
  @ApiOperation({ summary: 'Get heatmap' })
  getHeatmap() {
    return this.dailyLogsService.getHeatmap();
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today daily log' })
  getToday() {
    return this.dailyLogsService.getTodayLog();
  }

  @Get('streak')
  @ApiOperation({ summary: 'Get streak' })
  getStreak() {
    return this.dailyLogsService.getStreak();
  }

  @Get('date/:date')
  @ApiOperation({ summary: 'Get daily log by date (YYYY-MM-DD)' })
  findByDate(@Param('date') date: string) {
    return this.dailyLogsService.findByDate(date);
  }

  @Post()
  @ApiOperation({ summary: 'Create or update daily log' })
  createOrUpdate(@Body() dto: CreateDailyLogDto) {
    return this.dailyLogsService.createOrUpdate(dto);
  }

  @Post(':id/topics')
  @ApiOperation({ summary: 'Add topics to daily log' })
  addTopics(@Param('id', ParseIntPipe) id: number, @Body() dto: AddTopicsDto) {
    return this.dailyLogsService.addTopics(id, dto.topicIds);
  }
}
