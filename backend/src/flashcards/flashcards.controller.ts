import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service.js';
import { CreateFlashcardDto, ReviewFlashcardDto } from './dto/flashcard.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('flashcards')
@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Get('due')
  @ApiOperation({ summary: 'Get due flashcards' })
  findDue() {
    return this.flashcardsService.findDue();
  }

  @Get('topic/:topicId')
  @ApiOperation({ summary: 'Get flashcards by topic' })
  findByTopic(@Param('topicId', ParseIntPipe) topicId: number) {
    return this.flashcardsService.findByTopic(topicId);
  }

  @Post()
  @ApiOperation({ summary: 'Create flashcard' })
  create(@Body() dto: CreateFlashcardDto) {
    return this.flashcardsService.create(dto);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Review flashcard' })
  review(@Param('id', ParseIntPipe) id: number, @Body() dto: ReviewFlashcardDto) {
    return this.flashcardsService.review(id, dto.quality);
  }
}
