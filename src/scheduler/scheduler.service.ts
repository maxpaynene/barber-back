import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { Scheduler } from './entities/scheduler.entity';
import { CreateSchedulerDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';

interface FindAllFilters {
  barberId?: number;
  date?: string;
  from?: string;
  to?: string;
}

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(Scheduler)
    private readonly schedulerRepository: Repository<Scheduler>,
  ) {}

  async create(createDto: CreateSchedulerDto) {
    if (!createDto.dateHour) {
      throw new BadRequestException('dateHour es obligatorio');
    }
    const start = new Date(createDto.dateHour);
    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException('dateHour inválido');
    }
    const duration =
      createDto.estimatedDuration && createDto.estimatedDuration > 0
        ? createDto.estimatedDuration
        : 30;
    const end = new Date(start.getTime() + duration * 60000);

    if (start >= end) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la de fin');
    }

    if (createDto.barberId) {
      const overlap = await this.findOverlap(createDto.barberId, start, end);
      if (overlap) {
        throw new ConflictException(
          'El barbero ya tiene una cita que se solapa con ese horario',
        );
      }
    }

    const block = this.schedulerRepository.create({
      barberId: createDto.barberId ?? null,
      clientId: createDto.clientId ?? null,
      serviceId: createDto.serviceId ?? null,
      dateHour: start,
      estimatedDuration: duration,
      finalCost: createDto.finalCost ?? null,
      status: createDto.status || 'pending',
      barberNotes: createDto.barberNotes ?? null,
    });

    return await this.schedulerRepository.save(block);
  }

  async findAll(filters: FindAllFilters = {}) {
    const where: any = {};
    const order = { dateHour: 'ASC' as const };

    if (filters.barberId) {
      where.barberId = filters.barberId;
    }

    if (filters.date) {
      const dayStart = new Date(`${filters.date}T00:00:00`);
      const dayEnd = new Date(`${filters.date}T23:59:59.999`);
      if (!Number.isNaN(dayStart.getTime())) {
        where.dateHour = Between(dayStart, dayEnd);
      }
    } else if (filters.from || filters.to) {
      const fromDate = filters.from
        ? new Date(`${filters.from}T00:00:00`)
        : new Date(0);
      const toDate = filters.to
        ? new Date(`${filters.to}T23:59:59.999`)
        : new Date('9999-12-31T23:59:59.999');
      if (!Number.isNaN(fromDate.getTime()) && !Number.isNaN(toDate.getTime())) {
        where.dateHour = Between(fromDate, toDate);
      }
    }

    return await this.schedulerRepository.find({ where, order });
  }

  async remove(id: number) {
    const block = await this.schedulerRepository.findOneBy({ id });
    if (!block) throw new NotFoundException('Cita no encontrada');
    await this.schedulerRepository.softDelete(id);
  }

  async update(id: number, updateDto: UpdateSchedulerDto) {
    const block = await this.schedulerRepository.findOneBy({ id });
    if (!block) throw new NotFoundException('Cita no encontrada');

    let start = block.dateHour;
    let duration =
      updateDto.estimatedDuration ?? block.estimatedDuration ?? 30;
    let end = new Date(start.getTime() + duration * 60000);

    if (updateDto.dateHour) {
      const newStart = new Date(updateDto.dateHour);
      if (Number.isNaN(newStart.getTime())) {
        throw new BadRequestException('dateHour inválido');
      }
      duration =
        updateDto.estimatedDuration && updateDto.estimatedDuration > 0
          ? updateDto.estimatedDuration
          : block.estimatedDuration && block.estimatedDuration > 0
            ? block.estimatedDuration
            : 30;
      end = new Date(newStart.getTime() + duration * 60000);
      if (newStart >= end) {
        throw new BadRequestException('La fecha de inicio debe ser anterior a la de fin');
      }
      start = newStart;
    }

    const barberId = updateDto.barberId ?? block.barberId;
    if (barberId) {
      const overlap = await this.findOverlap(barberId, start, end, id);
      if (overlap) {
        throw new ConflictException(
          'El barbero ya tiene una cita que se solapa con ese horario',
        );
      }
    }

    Object.assign(block, updateDto);
    return await this.schedulerRepository.save(block);
  }

  private async findOverlap(
    barberId: number,
    start: Date,
    end: Date,
    excludeId?: number,
  ): Promise<Scheduler | null> {
    const conflicting = await this.schedulerRepository
      .createQueryBuilder('s')
      .where('s.barberId = :barberId', { barberId })
      .andWhere('s.status NOT IN (:...statuses)', {
        statuses: ['cancelled', 'no_show'],
      })
      .andWhere('s.dateHour < :end', { end })
      .andWhere(
        'DATE_ADD(s.dateHour, INTERVAL COALESCE(s.estimatedDuration, 30) MINUTE) > :start',
        { start },
      )
      .getOne();

    if (!conflicting) return null;
    if (excludeId && conflicting.id === excludeId) return null;
    return conflicting;
  }
}