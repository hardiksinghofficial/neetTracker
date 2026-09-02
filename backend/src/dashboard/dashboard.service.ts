import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DailyLogsService } from '../daily-logs/daily-logs.service.js';
import { getIndianDateString, isIndianCurfewActive } from '../common/time.helper.js';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService, private dailyLogsService: DailyLogsService) {}

  async getSummary() {
    const totalTopics = await this.prisma.topic.count();
    const completedTopics = await this.prisma.topic.count({ where: { status: { in: ['COMPLETED', 'REVISED'] } } });
    const syllabusCompletion = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    const streak = await this.dailyLogsService.getStreak();
    const todayLog = await this.dailyLogsService.getTodayLog();
    const isCurfew = isIndianCurfewActive();
    
    const recentTests = await this.prisma.test.findMany({
      take: 5,
      orderBy: { date: 'desc' }
    });

    return {
      syllabusCompletion,
      streak,
      daysRemainingToNEET: 265,
      curfewActive: isCurfew,
      todayDateIST: getIndianDateString(),
      todayHoursStudied: todayLog?.hoursStudied ?? 0,
      recentTests,
    };
  }
}
