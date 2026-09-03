import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ChaptersService } from './chapters.service.js';
import { CreateChapterDto } from './dto/create-chapter.dto.js';
import { UpdateChapterDto } from './dto/update-chapter.dto.js';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('chapters')
@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  @ApiOperation({ summary: 'Create chapter' })
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chaptersService.create(createChapterDto);
  }

  @Post('bulk-sync')
  @ApiOperation({ summary: 'Bulk sync chapters rating, completion, revision and notes' })
  bulkSync(@Body() chapters: Array<{ id?: number; name?: string; rating?: number; isCompleted?: boolean; isRevised?: boolean; notes?: string }>) {
    return this.chaptersService.bulkSync(chapters);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chapters' })
  @ApiQuery({ name: 'subjectId', required: false, type: Number })
  findAll(@Query('subjectId') subjectId?: string) {
    return this.chaptersService.findAll(subjectId ? +subjectId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one chapter' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chaptersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update chapter' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chaptersService.update(id, updateChapterDto);
  }
}
