import { PartialType } from '@nestjs/swagger';
import { CreateSchedulerBarberDto } from './create-scheduler-barber.dto';

export class UpdateSchedulerBarberDto extends PartialType(CreateSchedulerBarberDto) {}
