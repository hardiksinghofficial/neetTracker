import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service.js';
import { CreatePomodoroDto } from './dto/create-pomodoro.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('pomodoro')
@Controller('pomodoro')
export class PomodoroController {
  constructor(private readonly pomodoroService: PomodoroService) {}

  @Post()
  @ApiOperation({ summary: 'Create pomodoro session' })
  create(@Body() dto: CreatePomodoroDto) {
    return this.pomodoroService.create(dto);
  }

  @Get('daily-log/:dailyLogId')
  @ApiOperation({ summary: 'Get pomodoros by daily log' })
  findByDailyLog(@Param('dailyLogId', ParseIntPipe) dailyLogId: number) {
    return this.pomodoroService.findByDailyLog(dailyLogId);
  }
}
