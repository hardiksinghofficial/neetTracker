import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('export')
@Controller('export')
export class ExportController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Export all data' })
  async exportData() {
    const data = {
      subjects: await this.prisma.subject.findMany(),
      chapters: await this.prisma.chapter.findMany(),
      topics: await this.prisma.topic.findMany(),
      dailyLogs: await this.prisma.dailyLog.findMany(),
      tests: await this.prisma.test.findMany(),
    };
    return data;
  }
}
