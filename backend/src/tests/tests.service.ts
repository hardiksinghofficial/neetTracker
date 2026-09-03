import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BadgesService } from '../badges/badges.service.js';
import { CreateTestDto } from './dto/test.dto.js';
import { TestType } from '@prisma/client';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService, private badgesService: BadgesService) {}

  async create(data: CreateTestDto) {
    const computedScore = data.correctAnswers * 4 - data.wrongAnswers * 1;
    const estimatedPercentile = this.calculatePercentile(computedScore);
    
    const test = await this.prisma.test.create({
      data: {
        ...data,
        computedScore,
        estimatedPercentile,
      }
    });

    await this.badgesService.checkAndAward();
    return test;
  }

  async findAll(testType?: TestType, subjectScopeId?: number) {
    try {
      const where: any = {};
      if (testType) where.testType = testType;
      if (subjectScopeId) where.subjectScopeId = subjectScopeId;
      
      return await this.prisma.test.findMany({ where, orderBy: { date: 'desc' } });
    } catch (e: any) {
      console.error('Error in TestsService.findAll():', e);
      return [];
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.test.findUnique({
        where: { id },
        include: { mistakes: true, subjectScope: true }
      });
    } catch (e: any) {
      console.error('Error in TestsService.findOne():', e);
      return null;
    }
  }

  async getScoreTrends() {
    return this.prisma.test.findMany({
      orderBy: { date: 'asc' },
      select: { date: true, computedScore: true, estimatedPercentile: true, testType: true }
    });
  }

  private calculatePercentile(score: number): number {
    const lookup = [
      { s: 720, p: 99.99 },
      { s: 680, p: 99.9 },
      { s: 650, p: 99.5 },
      { s: 620, p: 99 },
      { s: 580, p: 97 },
      { s: 540, p: 95 },
      { s: 500, p: 90 },
      { s: 450, p: 80 },
      { s: 400, p: 70 },
      { s: 350, p: 55 },
      { s: 300, p: 40 },
      { s: 250, p: 25 },
      { s: 200, p: 15 },
      { s: 150, p: 8 },
      { s: 100, p: 3 },
    ];
    for (let i = 0; i < lookup.length; i++) {
      if (score >= lookup[i].s) return lookup[i].p;
    }
    return 1;
  }
}
