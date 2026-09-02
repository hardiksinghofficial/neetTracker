import { Module } from '@nestjs/common';
import { RevisionService } from './revision.service.js';
import { RevisionController } from './revision.controller.js';

@Module({
  controllers: [RevisionController],
  providers: [RevisionService],
})
export class RevisionModule {}
