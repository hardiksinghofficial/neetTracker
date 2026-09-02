import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePomodoroDto } from './dto/create-pomodoro.dto.js';

@Injectable()
export class PomodoroService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePomodoroDto) {
    const session = await this.prisma.pomodoroSession.create({ data });
    
    // Increment daily log hours
    const hours = data.workDurationMinutes / 60;
    await this.prisma.dailyLog.update({
      where: { id: data.dailyLogId },
      data: { hoursStudied: { increment: hours } }
    });
    
    return session;
  }

  findByDailyLog(dailyLogId: number) {
    return this.prisma.pomodoroSession.findMany({
      where: { dailyLogId },
      orderBy: { completedAt: 'desc' }
    });
  }
}
