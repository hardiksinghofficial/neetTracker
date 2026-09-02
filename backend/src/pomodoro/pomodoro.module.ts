import { Module } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service.js';
import { PomodoroController } from './pomodoro.controller.js';

@Module({
  controllers: [PomodoroController],
  providers: [PomodoroService],
})
export class PomodoroModule {}
