import { Module } from '@nestjs/common';
import { ParentNotesService } from './parent-notes.service.js';
import { ParentNotesController } from './parent-notes.controller.js';

@Module({
  controllers: [ParentNotesController],
  providers: [ParentNotesService],
})
export class ParentNotesModule {}
