import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service.js';

@ApiTags('Health & Keep-Alive')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check & Keep-Alive ping endpoint' })
  @ApiResponse({ status: 200, description: 'Server is healthy, warm, and active' })
  async checkHealth() {
    let dbStatus = 'connected';
    let dbError: any = null;
    let chapters = 0;
    try {
      chapters = await this.prisma.chapter.count();
    } catch (err: any) {
      dbStatus = 'error';
      dbError = err?.message || String(err);
    }

    return {
      status: 'ok',
      service: 'NEET 2027 Tracker Backend API',
      database: dbStatus,
      chapterCount: chapters,
      dbError,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    };
  }
}
