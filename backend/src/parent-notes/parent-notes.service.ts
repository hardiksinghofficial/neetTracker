import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateParentNoteDto } from './dto/parent-note.dto.js';

@Injectable()
export class ParentNotesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.parentNote.findMany({ orderBy: { date: 'desc' } });
  }

  create(data: CreateParentNoteDto) {
    return this.prisma.parentNote.create({ data });
  }
}
