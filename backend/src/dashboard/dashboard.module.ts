import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { DailyLogsModule } from '../daily-logs/daily-logs.module.js';

@Module({
  imports: [DailyLogsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
