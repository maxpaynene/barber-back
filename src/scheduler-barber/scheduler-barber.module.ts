import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulerBarberController } from './scheduler-barber.controller';
import { SchedulerBarberService } from './scheduler-barber.service';
import { SchedulerBarber } from './entities/scheduler-barber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchedulerBarber])],
  controllers: [SchedulerBarberController],
  providers: [SchedulerBarberService],
})
export class SchedulerBarberModule {}
