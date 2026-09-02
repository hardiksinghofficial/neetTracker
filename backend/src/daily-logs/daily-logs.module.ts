import { Global, Module } from '@nestjs/common';
import { DailyLogsService } from './daily-logs.service.js';
import { DailyLogsController } from './daily-logs.controller.js';

@Global()
@Module({
  controllers: [DailyLogsController],
  providers: [DailyLogsService],
  exports: [DailyLogsService],
})
export class DailyLogsModule {}
