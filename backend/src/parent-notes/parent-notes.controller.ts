import { Controller, Get, Post, Body } from '@nestjs/common';
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
