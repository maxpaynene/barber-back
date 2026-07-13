import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarbersService } from './barbers.service';
import { BarbersController } from './barbers.controller';
import { Barber } from './entities/barber.entity';
import { User } from '../users/entities/user.entity';
import { SchedulerBarber } from '../scheduler-barber/entities/scheduler-barber.entity';
import { BarberDefaultScheduleModule } from '../barber-default-schedule/barber-default-schedule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Barber, User, SchedulerBarber]),
    BarberDefaultScheduleModule,
  ],
  controllers: [BarbersController],
  providers: [BarbersService],
})
export class BarbersModule {}
