import { PartialType } from '@nestjs/mapped-types';
import { CreateParentNoteDto } from './create-parent-note.dto.js';

export class UpdateParentNoteDto extends PartialType(CreateParentNoteDto) {}
