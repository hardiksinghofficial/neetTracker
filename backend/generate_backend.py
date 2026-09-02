import os

base_dir = "c:/Users/hardi/OneDrive/Pictures/NeetTracker/backend/src"

files = {
    "prisma/prisma.service.ts": """import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
""",
    "prisma/prisma.module.ts": """import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
""",
    "subjects/subjects.module.ts": """import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service.js';
import { SubjectsController } from './subjects.controller.js';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
""",
    "subjects/subjects.controller.ts": """import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SubjectsService } from './subjects.service.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all subjects with chapters count' })
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one subject with chapters and topics' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.findOne(id);
  }
}
""",
    "subjects/subjects.service.ts": """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.subject.findMany({
      include: {
        _count: {
          select: { chapters: true }
        }
      }
    });
  }

  findOne(id: number) {
    return this.prisma.subject.findUnique({
      where: { id },
      include: {
        chapters: {
          include: { topics: true }
        }
      }
    });
  }
}
""",
    "chapters/dto/create-chapter.dto.ts": """import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty()
  @IsNumber()
  subjectId: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  classLevel: number;

  @ApiProperty()
  @IsNumber()
  weightage: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isHighYield?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subGroup?: string;
}
""",
    "chapters/dto/update-chapter.dto.ts": """import { PartialType } from '@nestjs/swagger';
import { CreateChapterDto } from './create-chapter.dto.js';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {}
""",
    "chapters/chapters.controller.ts": """import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ChaptersService } from './chapters.service.js';
import { CreateChapterDto } from './dto/create-chapter.dto.js';
import { UpdateChapterDto } from './dto/update-chapter.dto.js';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('chapters')
@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  @ApiOperation({ summary: 'Create chapter' })
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chaptersService.create(createChapterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chapters' })
  @ApiQuery({ name: 'subjectId', required: false, type: Number })
  findAll(@Query('subjectId') subjectId?: string) {
    return this.chaptersService.findAll(subjectId ? +subjectId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one chapter' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chaptersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update chapter' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chaptersService.update(id, updateChapterDto);
  }
}
""",
    "chapters/chapters.service.ts": """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateChapterDto } from './dto/create-chapter.dto.js';
import { UpdateChapterDto } from './dto/update-chapter.dto.js';

@Injectable()
export class ChaptersService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateChapterDto) {
    return this.prisma.chapter.create({ data });
  }

  findAll(subjectId?: number) {
    const where = subjectId ? { subjectId } : {};
    return this.prisma.chapter.findMany({ where });
  }

  findOne(id: number) {
    return this.prisma.chapter.findUnique({
      where: { id },
      include: { topics: true }
    });
  }

  update(id: number, data: UpdateChapterDto) {
    return this.prisma.chapter.update({
      where: { id },
      data
    });
  }
}
""",
    "topics/dto/update-topic.dto.ts": """import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TopicStatus } from '@prisma/client';

export class UpdateTopicDto {
  @ApiPropertyOptional({ enum: TopicStatus })
  @IsEnum(TopicStatus)
  @IsOptional()
  status?: TopicStatus;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  confidenceRating?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  lastStudiedDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  lastRevisedDate?: string;
}
""",
    "topics/topics.controller.ts": """import { Controller, Get, Patch, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { TopicsService } from './topics.service.js';
import { UpdateTopicDto } from './dto/update-topic.dto.js';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all topics' })
  @ApiQuery({ name: 'chapterId', required: false, type: Number })
  findAll(@Query('chapterId') chapterId?: string) {
    return this.topicsService.findAll(chapterId ? +chapterId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one topic' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update topic' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(id, updateTopicDto);
  }
}
""",
    "topics/topics.service.ts": """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateTopicDto } from './dto/update-topic.dto.js';

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) {}

  findAll(chapterId?: number) {
    const where = chapterId ? { chapterId } : {};
    return this.prisma.topic.findMany({ where });
  }

  findOne(id: number) {
    return this.prisma.topic.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateTopicDto) {
    return this.prisma.topic.update({
      where: { id },
      data
    });
  }
}
""",
    "daily-logs/dto/create-daily-log.dto.ts": """import { IsNumber, IsOptional, IsString, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDailyLogDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  hoursStudied?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  checkInPhoto?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class AddTopicsDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  topicIds: number[];
}
""",
    "daily-logs/daily-logs.controller.ts": """import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
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
""",
    "daily-logs/daily-logs.service.ts": """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BadgesService } from '../badges/badges.service.js';
import { CreateDailyLogDto } from './dto/create-daily-log.dto.js';

@Injectable()
export class DailyLogsService {
  constructor(private prisma: PrismaService, private badgesService: BadgesService) {}

  findAll() {
    return this.prisma.dailyLog.findMany();
  }

  findByDate(dateStr: string) {
    const date = new Date(dateStr);
    return this.prisma.dailyLog.findUnique({
      where: { date },
      include: { topicsStudied: { include: { topic: true } }, pomodoros: true }
    });
  }

  async createOrUpdate(data: CreateDailyLogDto) {
    const date = new Date(data.date);
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
      select: { date: true }
    });
    return logs.map(l => ({ date: l.date, hasEntry: true }));
  }

  async getStreak() {
    const logs = await this.prisma.dailyLog.findMany({
      orderBy: { date: 'desc' },
      select: { date: true }
    });
    
    if (!logs.length) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    
    for (const log of logs) {
      const logDate = new Date(log.date);
      logDate.setHours(0,0,0,0);
      
      const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 0 || diffDays === 1) {
        streak++;
        currentDate = logDate;
      } else {
        break;
      }
    }
    return streak;
  }
}
""",
    "pomodoro/dto/create-pomodoro.dto.ts": """import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePomodoroDto {
  @ApiProperty()
  @IsNumber()
  dailyLogId: number;

  @ApiProperty()
  @IsNumber()
  workDurationMinutes: number;

  @ApiProperty()
  @IsNumber()
  breakDurationMinutes: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  distractionsLogged?: number;
}
""",
    "pomodoro/pomodoro.controller.ts": """import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
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
""",
    "pomodoro/pomodoro.service.ts": """import { Injectable } from '@nestjs/common';
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
""",
    "timetable/dto/timetable.dto.ts": """import { IsNumber, IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { DayOfWeek } from '@prisma/client';

export class CreateTimetableDto {
  @ApiProperty({ enum: DayOfWeek })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty()
  @IsNumber()
  subjectId: number;

  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsString()
  endTime: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  recurring?: boolean;
}

export class UpdateTimetableDto extends PartialType(CreateTimetableDto) {}
""",
    "timetable/timetable.controller.ts": """import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TimetableService } from './timetable.service.js';
import { CreateTimetableDto, UpdateTimetableDto } from './dto/timetable.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('timetable')
@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get()
  @ApiOperation({ summary: 'Get all slots' })
  findAll() {
    return this.timetableService.findAll();
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today slots' })
  findToday() {
    return this.timetableService.findToday();
  }

  @Post()
  @ApiOperation({ summary: 'Create slot' })
  create(@Body() dto: CreateTimetableDto) {
    return this.timetableService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update slot' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTimetableDto) {
    return this.timetableService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete slot' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.timetableService.delete(id);
  }
}
""",
    "timetable/timetable.service.ts": """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTimetableDto, UpdateTimetableDto } from './dto/timetable.dto.js';
import { DayOfWeek } from '@prisma/client';

@Injectable()
export class TimetableService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.timetableSlot.findMany({ include: { subject: true } });
  }

  findToday() {
    const days: DayOfWeek[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const today = days[new Date().getDay()];
    return this.prisma.timetableSlot.findMany({
      where: { dayOfWeek: today },
      include: { subject: true }
    });
  }

  create(data: CreateTimetableDto) {
    return this.prisma.timetableSlot.create({ data });
  }

  update(id: number, data: UpdateTimetableDto) {
    return this.prisma.timetableSlot.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.timetableSlot.delete({ where: { id } });
  }
}
""",
    "tests/dto/test.dto.ts": """import { IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TestType } from '@prisma/client';

export class CreateTestDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty({ enum: TestType })
  @IsEnum(TestType)
  testType: TestType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  subjectScopeId?: number;

  @ApiProperty()
  @IsNumber()
  totalQuestions: number;

  @ApiProperty()
  @IsNumber()
  correctAnswers: number;

  @ApiProperty()
  @IsNumber()
  wrongAnswers: number;

  @ApiProperty()
  @IsNumber()
  unattempted: number;

  @ApiProperty()
  @IsNumber()
  timeTakenMinutes: number;
}
""",
    "tests/tests.controller.ts": """import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { TestsService } from './tests.service.js';
import { CreateTestDto } from './dto/test.dto.js';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TestType } from '@prisma/client';

@ApiTags('tests')
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create test' })
  create(@Body() dto: CreateTestDto) {
    return this.testsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tests' })
  @ApiQuery({ name: 'testType', required: false, enum: TestType })
  @ApiQuery({ name: 'subjectScopeId', required: false, type: Number })
  findAll(
    @Query('testType') testType?: TestType,
    @Query('subjectScopeId') subjectScopeId?: string
  ) {
    return this.testsService.findAll(testType, subjectScopeId ? +subjectScopeId : undefined);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get score trends' })
  getScoreTrends() {
    return this.testsService.getScoreTrends();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one test' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.testsService.findOne(id);
  }
}
""",
    "tests/tests.service.ts": """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BadgesService } from '../badges/badges.service.js';
import { CreateTestDto } from './dto/test.dto.js';
import { TestType } from '@prisma/client';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService, private badgesService: BadgesService) {}

  async create(data: CreateTestDto) {
    const computedScore = data.correctAnswers * 4 - data.wrongAnswers * 1;
    const estimatedPercentile = this.calculatePercentile(computedScore);
    
    const test = await this.prisma.test.create({
      data: {
        ...data,
        computedScore,
        estimatedPercentile,
      }
    });

    await this.badgesService.checkAndAward();
    return test;
  }

  findAll(testType?: TestType, subjectScopeId?: number) {
    const where: any = {};
    if (testType) where.testType = testType;
    if (subjectScopeId) where.subjectScopeId = subjectScopeId;
    
    return this.prisma.test.findMany({ where, orderBy: { date: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.test.findUnique({
      where: { id },
      include: { mistakes: true, subjectScope: true }
    });
  }

  async getScoreTrends() {
    return this.prisma.test.findMany({
      orderBy: { date: 'asc' },
      select: { date: true, computedScore: true, estimatedPercentile: true, testType: true }
    });
  }

  private calculatePercentile(score: number): number {
    const lookup = [
      { s: 720, p: 99.99 },
      { s: 680, p: 99.9 },
      { s: 650, p: 99.5 },
      { s: 620, p: 99 },
      { s: 580, p: 97 },
      { s: 540, p: 95 },
      { s: 500, p: 90 },
      { s: 450, p: 80 },
      { s: 400, p: 70 },
      { s: 350, p: 55 },
      { s: 300, p: 40 },
      { s: 250, p: 25 },
      { s: 200, p: 15 },
      { s: 150, p: 8 },
      { s: 100, p: 3 },
    ];
    for (let i = 0; i < lookup.length; i++) {
      if (score >= lookup[i].s) return lookup[i].p;
    }
    return 1;
  }
}
""",
    "revision/revision.controller.ts": """import { Controller, Get } from '@nestjs/common';
import { RevisionService } from './revision.service.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('revision')
@Controller('revision')
export class RevisionController {
  constructor(private readonly revisionService: RevisionService) {}

  @Get('due')
  @ApiOperation({ summary: 'Get due topics' })
  getDueTopics() {
    return this.revisionService.getDueTopics();
  }

  @Get('weak')
  @ApiOperation({ summary: 'Get weak topics' })
  getWeakTopics() {
    return this.revisionService.getWeakTopics();
  }
}
""",
    "revision/revision.service.ts": """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RevisionService {
  constructor(private prisma: PrismaService) {}

  async getDueTopics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const topics = await this.prisma.topic.findMany({
      where: {
        OR: [
          { lastRevisedDate: { lt: thirtyDaysAgo } },
          { lastRevisedDate: null, lastStudiedDate: { lt: thirtyDaysAgo } }
        ]
      },
      include: { chapter: true }
    });
    return topics;
  }

  async getWeakTopics() {
    const topics = await this.prisma.topic.findMany({
      where: {
        OR: [
          { confidenceRating: { lte: 2 } },
          { testMistakes: { some: { mistakeReason: 'CONCEPT_GAP' } } }
        ]
      },
      include: { chapter: true },
      orderBy: { chapter: { weightage: 'desc' } }
    });
    return topics;
  }
}
""",
    "badges/badges.controller.ts": """import { Controller, Get } from '@nestjs/common';
import { BadgesService } from './badges.service.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('badges')
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all badges' })
  findAll() {
    return this.badgesService.findAll();
  }
}
""",
    "badges/badges.service.ts": """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.badge.findMany();
  }

  async checkAndAward() {
    const badges = await this.prisma.badge.findMany({ where: { earnedDate: null } });
    
    // Very simplified check loop
    for (const badge of badges) {
      let earned = false;
      if (badge.conditionType === 'TESTS_TAKEN') {
        const count = await this.prisma.test.count();
        if (count >= badge.conditionThreshold) earned = true;
      }
      // other conditions would be checked similarly
      if (earned) {
        await this.prisma.badge.update({
          where: { id: badge.id },
          data: { earnedDate: new Date() }
        });
      }
    }
  }
}
""",
    "parent-notes/dto/parent-note.dto.ts": """import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParentNoteDto {
  @ApiProperty()
  @IsString()
  message: string;
}
""",
    "parent-notes/parent-notes.controller.ts": """import { Controller, Get, Post, Body } from '@nestjs/common';
import { ParentNotesService } from './parent-notes.service.js';
import { CreateParentNoteDto } from './dto/parent-note.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('parent-notes')
@Controller('parent-notes')
export class ParentNotesController {
  constructor(private readonly parentNotesService: ParentNotesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  findAll() {
    return this.parentNotesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create note' })
  create(@Body() dto: CreateParentNoteDto) {
    return this.parentNotesService.create(dto);
  }
}
""",
    "parent-notes/parent-notes.service.ts": """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateParentNoteDto } from './dto/parent-note.dto.js';

@Injectable()
export class ParentNotesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.parentNote.findMany({ orderBy: { date: 'desc' } });
  }

  create(data: CreateParentNoteDto) {
    return this.prisma.parentNote.create({ data });
  }
}
""",
    "settings/dto/settings.dto.ts": """import { IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  neetExamDate?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  pomodoroDefaultWorkMinutes?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  pomodoroDefaultBreakMinutes?: number;
}
""",
    "settings/settings.controller.ts": """import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { UpdateSettingsDto } from './dto/settings.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get settings' })
  get() {
    return this.settingsService.get();
  }

  @Patch()
  @ApiOperation({ summary: 'Update settings' })
  update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(dto);
  }
}
""",
    "settings/settings.service.ts": """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateSettingsDto } from './dto/settings.dto.js';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    let settings = await this.prisma.appSettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await this.prisma.appSettings.create({
        data: { id: 1, familyAccessCodeHash: 'default' }
      });
    }
    return settings;
  }

  async update(data: UpdateSettingsDto) {
    return this.prisma.appSettings.update({
      where: { id: 1 },
      data
    });
  }
}
""",
    "flashcards/dto/flashcard.dto.ts": """import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFlashcardDto {
  @ApiProperty()
  @IsNumber()
  topicId: number;

  @ApiProperty()
  @IsString()
  frontContent: string;

  @ApiProperty()
  @IsString()
  backContent: string;
}

export class ReviewFlashcardDto {
  @ApiProperty()
  @IsNumber()
  quality: number; // 0-5
}
""",
    "flashcards/flashcards.controller.ts": """import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service.js';
import { CreateFlashcardDto, ReviewFlashcardDto } from './dto/flashcard.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('flashcards')
@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Get('due')
  @ApiOperation({ summary: 'Get due flashcards' })
  findDue() {
    return this.flashcardsService.findDue();
  }

  @Get('topic/:topicId')
  @ApiOperation({ summary: 'Get flashcards by topic' })
  findByTopic(@Param('topicId', ParseIntPipe) topicId: number) {
    return this.flashcardsService.findByTopic(topicId);
  }

  @Post()
  @ApiOperation({ summary: 'Create flashcard' })
  create(@Body() dto: CreateFlashcardDto) {
    return this.flashcardsService.create(dto);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Review flashcard' })
  review(@Param('id', ParseIntPipe) id: number, @Body() dto: ReviewFlashcardDto) {
    return this.flashcardsService.review(id, dto.quality);
  }
}
""",
    "flashcards/flashcards.service.ts": """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFlashcardDto } from './dto/flashcard.dto.js';

@Injectable()
export class FlashcardsService {
  constructor(private prisma: PrismaService) {}

  findByTopic(topicId: number) {
    return this.prisma.flashcard.findMany({ where: { topicId } });
  }

  findDue() {
    return this.prisma.flashcard.findMany({
      where: { nextReviewDate: { lte: new Date() } }
    });
  }

  create(data: CreateFlashcardDto) {
    return this.prisma.flashcard.create({ data });
  }

  async review(id: number, quality: number) {
    const card = await this.prisma.flashcard.findUnique({ where: { id } });
    if (!card) return null;

    let { easeFactor, interval, repetitions } = card;

    if (quality >= 3) {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);
      repetitions++;
    } else {
      repetitions = 0;
      interval = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return this.prisma.flashcard.update({
      where: { id },
      data: { easeFactor, interval, repetitions, nextReviewDate }
    });
  }
}
""",
    "auth/dto/auth.dto.ts": """import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCodeDto {
  @ApiProperty()
  @IsString()
  code: string;
}
""",
    "auth/auth.controller.ts": """import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthCodeDto } from './dto/auth.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  @ApiOperation({ summary: 'Verify access code' })
  verify(@Body() dto: AuthCodeDto) {
    return this.authService.verify(dto.code);
  }

  @Post('setup')
  @ApiOperation({ summary: 'Setup access code' })
  setup(@Body() dto: AuthCodeDto) {
    return this.authService.setup(dto.code);
  }
}
""",
    "auth/auth.service.ts": """import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async verify(code: string) {
    const settings = await this.prisma.appSettings.findUnique({ where: { id: 1 } });
    if (!settings || settings.familyAccessCodeHash !== code) {
      throw new UnauthorizedException('Invalid access code');
    }
    return { success: true };
  }

  async setup(code: string) {
    return this.prisma.appSettings.upsert({
      where: { id: 1 },
      update: { familyAccessCodeHash: code },
      create: { id: 1, familyAccessCodeHash: code }
    });
  }
}
""",
    "dashboard/dashboard.module.ts": """import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { DailyLogsModule } from '../daily-logs/daily-logs.module.js';

@Module({
  imports: [DailyLogsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
""",
    "dashboard/dashboard.controller.ts": """import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard summary' })
  getSummary() {
    return this.dashboardService.getSummary();
  }
}
""",
    "dashboard/dashboard.service.ts": """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DailyLogsService } from '../daily-logs/daily-logs.service.js';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService, private dailyLogsService: DailyLogsService) {}

  async getSummary() {
    const totalTopics = await this.prisma.topic.count();
    const completedTopics = await this.prisma.topic.count({ where: { status: { in: ['COMPLETED', 'REVISED'] } } });
    const syllabusCompletion = totalTopics ? (completedTopics / totalTopics) * 100 : 0;
    
    const streak = await this.dailyLogsService.getStreak();
    
    const recentTests = await this.prisma.test.findMany({
      take: 5,
      orderBy: { date: 'desc' }
    });

    return {
      syllabusCompletion,
      streak,
      recentTests,
      // more stats could be added here
    };
  }
}
""",
    "export/export.module.ts": """import { Module } from '@nestjs/common';
import { ExportController } from './export.controller.js';

@Module({
  controllers: [ExportController],
})
export class ExportModule {}
""",
    "export/export.controller.ts": """import { Controller, Get } from '@nestjs/common';
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
"""
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Files created.")
