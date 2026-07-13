import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberDefaultSchedule } from './entities/barber-default-schedule.entity';
import { BarberDefaultScheduleService } from './barber-default-schedule.service';
import { BarberDefaultScheduleController } from './barber-default-schedule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BarberDefaultSchedule])],
  controllers: [BarberDefaultScheduleController],
  providers: [BarberDefaultScheduleService],
  exports: [BarberDefaultScheduleService],
})
export class BarberDefaultScheduleModule {}
