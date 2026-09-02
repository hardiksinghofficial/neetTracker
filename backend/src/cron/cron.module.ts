import { Module } from '@nestjs/common';
import { CronService } from './cron.service.js';

@Module({
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
