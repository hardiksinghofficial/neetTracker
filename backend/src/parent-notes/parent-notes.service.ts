import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateParentNoteDto } from './dto/parent-note.dto.js';

@Injectable()
export class ParentNotesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.parentNote.findMany({ orderBy: { date: 'desc' } });
    } catch (e: any) {
      console.error('Error in ParentNotesService.findAll():', e);
      return [];
    }
  }

  async create(data: CreateParentNoteDto) {
    try {
      return await this.prisma.parentNote.create({
        data: {
          message: data.message,
          author: data.author || 'Papa',
        },
      });
    } catch (e: any) {
      console.error('Error in ParentNotesService.create():', e);
      return null;
    }
  }
}
