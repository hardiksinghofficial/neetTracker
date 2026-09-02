import { Global, Module } from '@nestjs/common';
import { BadgesService } from './badges.service.js';
import { BadgesController } from './badges.controller.js';

@Global()
@Module({
  controllers: [BadgesController],
  providers: [BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}
