import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('status')
  getStatus() {
    return {
      status: 'ok',
      service: 'neet-tracker-api',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ping')
  getPing() {
    return { status: 'pong', timestamp: new Date().toISOString() };
  }

  @Get('health')
  async getHealth() {
    try {
      const count = await this.prisma.chapter.count();
      return {
        status: 'ok',
        service: 'neet-tracker-api',
        db: 'connected',
        chapterCount: count,
        timestamp: new Date().toISOString(),
      };
    } catch (e: any) {
      return {
        status: 'error',
        service: 'neet-tracker-api',
        db: 'failed',
        error: e?.message || String(e),
        stack: e?.stack,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
