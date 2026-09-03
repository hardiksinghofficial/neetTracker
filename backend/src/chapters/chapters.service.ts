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
      let chapter = await this.prisma.chapter.findUnique({
        where: { id },
        include: { topics: true }
      });

      if (!chapter) {
        const resolvedId = await this.resolveChapterId(id);
        if (resolvedId) {
          chapter = await this.prisma.chapter.findUnique({
            where: { id: resolvedId },
            include: { topics: true }
          });
        }
      }

      return chapter;
    } catch (e: any) {
      console.error('Error in ChaptersService.findOne():', e);
      return null;
    }
  }

  async update(id: number, data: UpdateChapterDto) {
    try {
      let targetId = id;
      const existing = await this.prisma.chapter.findUnique({ where: { id } });
      if (!existing) {
        const mappedId = await this.resolveChapterId(id);
        if (mappedId) {
          targetId = mappedId;
        } else {
          return { success: false, message: `Chapter ${id} not found` };
        }
      }

      return await this.prisma.chapter.update({
        where: { id: targetId },
        data: {
          ...(data.rating !== undefined && { rating: data.rating }),
          ...(data.isCompleted !== undefined && { isCompleted: data.isCompleted }),
          ...(data.isRevised !== undefined && { isRevised: data.isRevised }),
          ...(data.notes !== undefined && { notes: data.notes }),
          ...(data.weightage !== undefined && { weightage: data.weightage }),
          ...(data.isHighYield !== undefined && { isHighYield: data.isHighYield }),
        }
      });
    } catch (e: any) {
      console.error(`Error in ChaptersService.update(${id}):`, e);
      return { success: false, error: e?.message };
    }
  }

  private async resolveChapterId(id: number): Promise<number | null> {
    try {
      let subjectId = 1;
      let indexInSubject = id;
      if (id >= 101 && id < 200) {
        subjectId = 1;
        indexInSubject = id - 100;
      } else if (id >= 201 && id < 300) {
        subjectId = 2;
        indexInSubject = id - 200;
      } else if (id >= 301 && id < 400) {
        subjectId = 3;
        indexInSubject = id - 300;
      } else {
        return null;
      }

      const chapters = await this.prisma.chapter.findMany({
        where: { subjectId },
        orderBy: { id: 'asc' },
      });

      if (chapters[indexInSubject - 1]) {
        return chapters[indexInSubject - 1].id;
      }
      return null;
    } catch {
      return null;
    }
  }

  async bulkSync(chapters: Array<{ id?: number; name?: string; rating?: number; isCompleted?: boolean; isRevised?: boolean; notes?: string }>) {
    try {
      const results = [];
      for (const ch of chapters) {
        if (ch.name) {
          const updated = await this.prisma.chapter.updateMany({
            where: { name: { contains: ch.name, mode: 'insensitive' } },
            data: {
              ...(ch.rating !== undefined && { rating: ch.rating }),
              ...(ch.isCompleted !== undefined && { isCompleted: ch.isCompleted }),
              ...(ch.isRevised !== undefined && { isRevised: ch.isRevised }),
              ...(ch.notes !== undefined && { notes: ch.notes }),
            }
          });
          results.push(updated);
        } else if (ch.id) {
          const res = await this.update(ch.id, ch as any);
          results.push(res);
        }
      }
      return { success: true, count: results.length };
    } catch (e: any) {
      console.error('Error in ChaptersService.bulkSync():', e);
      return { success: false, error: e?.message };
    }
  }
}
