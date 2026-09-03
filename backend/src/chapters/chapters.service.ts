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

  async findAll(subjectId?: number) {
    try {
      const where = subjectId ? { subjectId } : {};
      return await this.prisma.chapter.findMany({ where });
    } catch (e: any) {
      console.error('Error in ChaptersService.findAll():', e);
      return [];
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.chapter.findUnique({
        where: { id },
        include: { topics: true }
      });
    } catch (e: any) {
      console.error('Error in ChaptersService.findOne():', e);
      return null;
    }
  }

  update(id: number, data: UpdateChapterDto) {
    return this.prisma.chapter.update({
      where: { id },
      data
    });
  }

  async bulkSync(chapters: Array<{ id?: number; name?: string; rating?: number; isCompleted?: boolean; isRevised?: boolean; notes?: string }>) {
    const results = [];
    for (const ch of chapters) {
      if (ch.id || ch.name) {
        const whereClause = ch.id ? { id: ch.id } : { name: ch.name };
        const updated = await this.prisma.chapter.updateMany({
          where: whereClause,
          data: {
            ...(ch.rating !== undefined && { rating: ch.rating }),
            ...(ch.isCompleted !== undefined && { isCompleted: ch.isCompleted }),
            ...(ch.isRevised !== undefined && { isRevised: ch.isRevised }),
            ...(ch.notes !== undefined && { notes: ch.notes }),
          }
        });
        results.push(updated);
      }
    }
    return { success: true, count: results.length };
  }
}
