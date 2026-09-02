import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service.js';
import { ChaptersController } from './chapters.controller.js';

@Module({
  controllers: [ChaptersController],
  providers: [ChaptersService],
})
export class ChaptersModule {}
