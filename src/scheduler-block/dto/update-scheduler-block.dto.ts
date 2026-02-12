import { PartialType } from '@nestjs/swagger';
import { CreateSchedulerBlockDto } from './create-scheduler-block.dto';

export class UpdateSchedulerBlockDto extends PartialType(CreateSchedulerBlockDto) {}
