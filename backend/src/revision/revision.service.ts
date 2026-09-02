import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RevisionService {
  constructor(private prisma: PrismaService) {}

  async getDueTopics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const topics = await this.prisma.topic.findMany({
      where: {
        OR: [
          { lastRevisedDate: { lt: thirtyDaysAgo } },
          { lastRevisedDate: null, lastStudiedDate: { lt: thirtyDaysAgo } }
        ]
      },
      include: { chapter: true }
    });
    return topics;
  }

  async getWeakTopics() {
    const topics = await this.prisma.topic.findMany({
      where: {
        OR: [
          { confidenceRating: { lte: 2 } },
          { testMistakes: { some: { mistakeReason: 'CONCEPT_GAP' } } }
        ]
      },
      include: { chapter: true },
      orderBy: { chapter: { weightage: 'desc' } }
    });
    return topics;
  }
}
