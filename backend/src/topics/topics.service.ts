import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateTopicDto } from './dto/update-topic.dto.js';

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) {}

  async findAll(chapterId?: number) {
    try {
      const where = chapterId ? { chapterId } : {};
      return await this.prisma.topic.findMany({ where });
    } catch (e: any) {
      console.error('Error in TopicsService.findAll():', e);
      return [];
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.topic.findUnique({ where: { id } });
    } catch (e: any) {
      console.error(`Error in TopicsService.findOne(${id}):`, e);
      return null;
    }
  }

  async update(id: number, data: UpdateTopicDto) {
    try {
      const existing = await this.prisma.topic.findUnique({ where: { id } });
      if (!existing) {
        return { success: false, message: `Topic ${id} not found` };
      }
      return await this.prisma.topic.update({
        where: { id },
        data
      });
    } catch (e: any) {
      console.error(`Error in TopicsService.update(${id}):`, e);
      return { success: false, error: e?.message };
    }
  }
}
