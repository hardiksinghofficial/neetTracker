import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateTopicDto } from './dto/update-topic.dto.js';

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) {}

  findAll(chapterId?: number) {
    const where = chapterId ? { chapterId } : {};
    return this.prisma.topic.findMany({ where });
  }

  findOne(id: number) {
    return this.prisma.topic.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateTopicDto) {
    return this.prisma.topic.update({
      where: { id },
      data
    });
  }
}
