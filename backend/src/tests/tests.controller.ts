import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { TestsService } from './tests.service.js';
import { CreateTestDto } from './dto/test.dto.js';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TestType } from '@prisma/client';

@ApiTags('tests')
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create test' })
  create(@Body() dto: CreateTestDto) {
    return this.testsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tests' })
  @ApiQuery({ name: 'testType', required: false, enum: TestType })
  @ApiQuery({ name: 'subjectScopeId', required: false, type: Number })
  findAll(
    @Query('testType') testType?: TestType,
    @Query('subjectScopeId') subjectScopeId?: string
  ) {
    return this.testsService.findAll(testType, subjectScopeId ? +subjectScopeId : undefined);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get score trends' })
  getScoreTrends() {
    return this.testsService.getScoreTrends();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one test' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.testsService.findOne(id);
  }
}
