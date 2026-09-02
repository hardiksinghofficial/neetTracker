import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateChapterDto } from './dto/create-chapter.dto.js';
import { UpdateChapterDto } from './dto/update-chapter.dto.js';

@Injectable()
export class ChaptersService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateChapterDto) {
    return this.prisma.chapter.create({ data });
  }

  findAll(subjectId?: number) {
    const where = subjectId ? { subjectId } : {};
    return this.prisma.chapter.findMany({ where });
  }

  findOne(id: number) {
    return this.prisma.chapter.findUnique({
      where: { id },
      include: { topics: true }
    });
  }

  update(id: number, data: UpdateChapterDto) {
    return this.prisma.chapter.update({
      where: { id },
      data
    });
  }
}
