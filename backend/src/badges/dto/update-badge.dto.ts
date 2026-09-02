import { PartialType } from '@nestjs/mapped-types';
import { CreateBadgeDto } from './create-badge.dto.js';

export class UpdateBadgeDto extends PartialType(CreateBadgeDto) {}
