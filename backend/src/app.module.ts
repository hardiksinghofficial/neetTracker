import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SubjectsModule } from './subjects/subjects.module.js';
import { ChaptersModule } from './chapters/chapters.module.js';
import { TopicsModule } from './topics/topics.module.js';
import { DailyLogsModule } from './daily-logs/daily-logs.module.js';
import { PomodoroModule } from './pomodoro/pomodoro.module.js';
import { TimetableModule } from './timetable/timetable.module.js';
import { TestsModule } from './tests/tests.module.js';
import { RevisionModule } from './revision/revision.module.js';
import { BadgesModule } from './badges/badges.module.js';
import { ParentNotesModule } from './parent-notes/parent-notes.module.js';
import { SettingsModule } from './settings/settings.module.js';
import { FlashcardsModule } from './flashcards/flashcards.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { ExportModule } from './export/export.module.js';
import { HealthModule } from './health/health.module.js';
import { CronModule } from './cron/cron.module.js';

@Module({
  imports: [
    PrismaModule,
    SubjectsModule,
    ChaptersModule,
    TopicsModule,
    DailyLogsModule,
    PomodoroModule,
    TimetableModule,
    TestsModule,
    RevisionModule,
    BadgesModule,
    ParentNotesModule,
    SettingsModule,
    FlashcardsModule,
    AuthModule,
    DashboardModule,
    ExportModule,
    HealthModule,
    CronModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
