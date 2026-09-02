import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.subject.findMany({
      include: {
        _count: {
          select: { chapters: true }
        }
      }
    });
  }

  findOne(id: number) {
    return this.prisma.subject.findUnique({
      where: { id },
      include: {
        chapters: {
          include: { topics: true }
        }
      }
    });
  }
}
