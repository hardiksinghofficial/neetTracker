import { Module } from '@nestjs/common';
import { TestsService } from './tests.service.js';
import { TestsController } from './tests.controller.js';

@Module({
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
