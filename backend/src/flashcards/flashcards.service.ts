import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFlashcardDto } from './dto/flashcard.dto.js';

@Injectable()
export class FlashcardsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.flashcard.findMany({
        include: { topic: { include: { chapter: { include: { subject: true } } } } },
        orderBy: { id: 'asc' }
      });
    } catch (e: any) {
      console.error('Error in FlashcardsService.findAll():', e);
      return [];
    }
  }

  async findByTopic(topicId: number) {
    try {
      return await this.prisma.flashcard.findMany({ where: { topicId } });
    } catch (e: any) {
      console.error('Error in FlashcardsService.findByTopic():', e);
      return [];
    }
  }

  async findDue() {
    try {
      return await this.prisma.flashcard.findMany({
        where: { nextReviewDate: { lte: new Date() } },
        include: { topic: { include: { chapter: { include: { subject: true } } } } }
      });
    } catch (e: any) {
      console.error('Error in FlashcardsService.findDue():', e);
      return [];
    }
  }

  create(data: CreateFlashcardDto) {
    return this.prisma.flashcard.create({ data });
  }

  async review(id: number, quality: number) {
    const card = await this.prisma.flashcard.findUnique({ where: { id } });
    if (!card) return null;

    let { easeFactor, interval, repetitions } = card;

    if (quality >= 3) {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);
      repetitions++;
    } else {
      repetitions = 0;
      interval = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return this.prisma.flashcard.update({
      where: { id },
      data: { easeFactor, interval, repetitions, nextReviewDate }
    });
  }
}
