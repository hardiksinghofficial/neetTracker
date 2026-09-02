import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TimetableService } from './timetable.service.js';
import { CreateTimetableDto, UpdateTimetableDto } from './dto/timetable.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('timetable')
@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get()
  @ApiOperation({ summary: 'Get all slots' })
  findAll() {
    return this.timetableService.findAll();
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today slots' })
  findToday() {
    return this.timetableService.findToday();
  }

  @Post()
  @ApiOperation({ summary: 'Create slot' })
  create(@Body() dto: CreateTimetableDto) {
    return this.timetableService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update slot' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTimetableDto) {
    return this.timetableService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete slot' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.timetableService.delete(id);
  }
}
