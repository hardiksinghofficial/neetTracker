import { PartialType } from '@nestjs/mapped-types';
import { CreateTestDto } from './create-test.dto.js';

export class UpdateTestDto extends PartialType(CreateTestDto) {}
