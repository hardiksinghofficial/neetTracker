import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BadgesService } from '../badges/badges.service.js';
import { CreateDailyLogDto } from './dto/create-daily-log.dto.js';
import { getIndianDateString } from '../common/time.helper.js';

@Injectable()
export class DailyLogsService {
  constructor(private prisma: PrismaService, private badgesService: BadgesService) {}

  async findAll() {
    try {
      const logs = await this.prisma.dailyLog.findMany({
        orderBy: { date: 'desc' },
      });
      return Promise.all(logs.map(log => this.autoCloseIfPastCurfew(log)));
    } catch (e: any) {
      console.error('Error in DailyLogsService.findAll():', e);
      return [];
    }
  }

  async findByDate(dateStr: string) {
    try {
      const date = new Date(dateStr);
      const log = await this.prisma.dailyLog.findUnique({
        where: { date },
      });
      return this.autoCloseIfPastCurfew(log);
    } catch (e: any) {
      console.error('Error in DailyLogsService.findByDate():', e);
      return null;
    }
  }

  async getTodayLog() {
    const todayIST = getIndianDateString();
    return this.findByDate(todayIST);
  }

  private async autoCloseIfPastCurfew(log: any) {
    if (log && log.checkInTimestamp && !log.checkOutTimestamp) {
      const logDate = new Date(log.date);
      const curfewTime = new Date(logDate);
      curfewTime.setHours(22, 0, 0, 0);
      const now = new Date();
      if (now.getTime() >= curfewTime.getTime()) {
        const grossSeconds = Math.max(0, Math.floor((curfewTime.getTime() - log.checkInTimestamp) / 1000));
        const netSeconds = Math.max(0, grossSeconds - (log.totalBreakSeconds || 0));
        const totalDurationHours = Math.round((netSeconds / 3600) * 10) / 10;
        return this.prisma.dailyLog.update({
          where: { id: log.id },
          data: {
            checkOutTime: '10:00 PM',
            checkOutTimestamp: curfewTime.getTime(),
            isOnBreak: false,
            currentBreakStartTime: null,
            totalDurationHours,
            hoursStudied: totalDurationHours,
            reflection: 'Auto-completed at 10:00 PM Night Curfew for optimal sleep & memory retention.',
          }
        });
      }
    }
    return log;
  }

  async createOrUpdate(data: CreateDailyLogDto) {
    const date = new Date(data.date || getIndianDateString());
    const hours = data.totalDurationHours ?? data.hoursStudied ?? 0;
    const log = await this.prisma.dailyLog.upsert({
      where: { date },
      update: {
        hoursStudied: hours,
        totalDurationHours: hours,
        checkInPhoto: data.checkInPhoto,
        notes: data.notes,
        checkInTime: data.checkInTime,
        checkInTimestamp: data.checkInTimestamp,
        checkOutTime: data.checkOutTime,
        checkOutTimestamp: data.checkOutTimestamp,
        isOnBreak: data.isOnBreak ?? false,
        currentBreakStartTime: data.currentBreakStartTime,
        totalBreakSeconds: data.totalBreakSeconds ?? 0,
        mood: data.mood,
        reflection: data.reflection,
      },
      create: {
        date,
        hoursStudied: hours,
        totalDurationHours: hours,
        checkInPhoto: data.checkInPhoto,
        notes: data.notes,
        checkInTime: data.checkInTime,
        checkInTimestamp: data.checkInTimestamp,
        checkOutTime: data.checkOutTime,
        checkOutTimestamp: data.checkOutTimestamp,
        isOnBreak: data.isOnBreak ?? false,
        currentBreakStartTime: data.currentBreakStartTime,
        totalBreakSeconds: data.totalBreakSeconds ?? 0,
        mood: data.mood,
        reflection: data.reflection,
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
