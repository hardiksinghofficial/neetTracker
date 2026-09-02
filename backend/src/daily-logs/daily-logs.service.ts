import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BadgesService } from '../badges/badges.service.js';
import { CreateDailyLogDto } from './dto/create-daily-log.dto.js';
import { getIndianDateString } from '../common/time.helper.js';

@Injectable()
export class DailyLogsService {
  constructor(private prisma: PrismaService, private badgesService: BadgesService) {}

  findAll() {
    return this.prisma.dailyLog.findMany({
      orderBy: { date: 'desc' },
      include: { topicsStudied: { include: { topic: true } }, pomodoros: true }
    });
  }

  findByDate(dateStr: string) {
    const date = new Date(dateStr);
    return this.prisma.dailyLog.findUnique({
      where: { date },
      include: { topicsStudied: { include: { topic: true } }, pomodoros: true }
    });
  }

  getTodayLog() {
    const todayIST = getIndianDateString();
    return this.findByDate(todayIST);
  }

  async createOrUpdate(data: CreateDailyLogDto) {
    const date = new Date(data.date || getIndianDateString());
    const log = await this.prisma.dailyLog.upsert({
      where: { date },
      update: {
        hoursStudied: data.hoursStudied,
        checkInPhoto: data.checkInPhoto,
        notes: data.notes,
      },
      create: {
        date,
        hoursStudied: data.hoursStudied ?? 0,
        checkInPhoto: data.checkInPhoto,
        notes: data.notes,
      }
    });
    
    // Check badges after log update
    await this.badgesService.checkAndAward();
    return log;
  }

  async addTopics(dailyLogId: number, topicIds: number[]) {
    await this.prisma.dailyLogTopic.createMany({
      data: topicIds.map(topicId => ({ dailyLogId, topicId })),
      skipDuplicates: true,
    });
    return { success: true };
  }

  async getHeatmap() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const logs = await this.prisma.dailyLog.findMany({
      where: { date: { gte: oneYearAgo } },
      select: { date: true, hoursStudied: true }
    });
    return logs.map(l => ({ 
      date: getIndianDateString(new Date(l.date)), 
      hoursStudied: l.hoursStudied,
      hasEntry: l.hoursStudied > 0 
    }));
  }

  async getStreak() {
    const logs = await this.prisma.dailyLog.findMany({
      orderBy: { date: 'desc' },
      select: { date: true, hoursStudied: true }
    });
    
    if (!logs.length) return 0;
    
    let streak = 0;
    const todayISTStr = getIndianDateString();
    let expectedDate = new Date(todayISTStr);
    
    for (const log of logs) {
      const logDateStr = getIndianDateString(new Date(log.date));
      const logDate = new Date(logDateStr);
      
      const diffDays = Math.floor((expectedDate.getTime() - logDate.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 0 || diffDays === 1) {
        if (log.hoursStudied > 0) {
          streak++;
        }
        expectedDate = logDate;
      } else {
        break;
      }
    }
    return streak;
  }
}
