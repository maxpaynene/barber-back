import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulerBlocksService } from './scheduler-blocks.service';
import { SchedulerBlocksController } from './scheduler-blocks.controller';
import { SchedulerBlock } from './entities/scheduler-blocks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchedulerBlock])],
  controllers: [SchedulerBlocksController],
  providers: [SchedulerBlocksService],
})
export class SchedulerBlocksModule {}
