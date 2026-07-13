import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BarberDefaultSchedule } from './entities/barber-default-schedule.entity';
import { UpdateBarberDefaultScheduleDto } from './dto/update-barber-default-schedule.dto';
import { UpdateBarberDefaultScheduleBulkDto } from './dto/update-barber-default-schedule-bulk.dto';

const DEFAULT_SEED: Array<{ dayOfWeek: number; startTime: string; endTime: string }> = [
  { dayOfWeek: 0, startTime: '10:00:00', endTime: '20:00:00' },
  { dayOfWeek: 1, startTime: '10:00:00', endTime: '20:00:00' },
  { dayOfWeek: 2, startTime: '10:00:00', endTime: '20:00:00' },
  { dayOfWeek: 3, startTime: '10:00:00', endTime: '20:00:00' },
  { dayOfWeek: 4, startTime: '10:00:00', endTime: '20:00:00' },
  { dayOfWeek: 5, startTime: '10:00:00', endTime: '20:00:00' },
  { dayOfWeek: 6, startTime: '10:00:00', endTime: '20:00:00' },
];

@Injectable()
export class BarberDefaultScheduleService implements OnModuleInit {
  constructor(
    @InjectRepository(BarberDefaultSchedule)
    private readonly repo: Repository<BarberDefaultSchedule>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      const seed = DEFAULT_SEED.map((d) =>
        this.repo.create({ ...d, isActive: true }),
      );
      await this.repo.save(seed);
    }
  }

  findAll(): Promise<BarberDefaultSchedule[]> {
    return this.repo.find({ order: { dayOfWeek: 'ASC' } });
  }

  async updateBulk(dto: UpdateBarberDefaultScheduleBulkDto): Promise<BarberDefaultSchedule[]> {
    const seen = new Set<number>();
    for (const item of dto.items) {
      if (seen.has(item.dayOfWeek)) {
        throw new BadRequestException(`Día ${item.dayOfWeek} duplicado en la petición`);
      }
      seen.add(item.dayOfWeek);
      const start = this.toMinutes(item.startTime);
      const end = this.toMinutes(item.endTime);
      if (start >= end && item.isActive) {
        throw new BadRequestException(
          `El día ${item.dayOfWeek} tiene hora de inicio posterior o igual a la de fin`,
        );
      }
    }

    await this.repo.manager.transaction(async (manager) => {
      const repo = manager.getRepository(BarberDefaultSchedule);
      await repo.clear();
      const rows = dto.items.map((i) =>
        repo.create({
          dayOfWeek: i.dayOfWeek,
          startTime: this.normalizeTime(i.startTime),
          endTime: this.normalizeTime(i.endTime),
          isActive: i.isActive,
        }),
      );
      await repo.save(rows);
    });

    return this.findAll();
  }

  private toMinutes(t: string): number {
    const [h = '0', m = '0'] = t.split(':');
    return parseInt(h, 10) * 60 + parseInt(m, 10);
  }

  private normalizeTime(t: string): string {
    return t.length === 5 ? `${t}:00` : t;
  }
}
