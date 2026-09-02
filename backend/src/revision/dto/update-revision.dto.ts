import { PartialType } from '@nestjs/mapped-types';
import { CreateRevisionDto } from './create-revision.dto.js';

export class UpdateRevisionDto extends PartialType(CreateRevisionDto) {}
