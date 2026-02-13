import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scheduler } from './entities/scheduler.entity';
import { CreateSchedulerDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(Scheduler)
    private readonly SchedulerRepository: Repository<Scheduler>,
  ) {}

  async create(createDto: CreateSchedulerDto) {
    const start = new Date(createDto.dateHour);
    const end = new Date(start.getTime() + (createDto.estimatedDuration || 30) * 60000);

    if (start >= end) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la de fin');
    }

    const block = this.SchedulerRepository.create({
      barberId: createDto.barberId,
      clientId: createDto.clientId,
      serviceId: createDto.serviceId,
      dateHour: start,
      estimatedDuration: createDto.estimatedDuration,
      finalCost: createDto.finalCost,
      status: createDto.status || 'pending',
      barberNotes: createDto.barberNotes,
    });

    return await this.SchedulerRepository.save(block);
  }

  async findAll() {
    return await this.SchedulerRepository.find({ order: { dateHour: 'ASC' } });
  }

  async remove(id: number) {
    const block = await this.SchedulerRepository.findOneBy({ id });
    if (!block) throw new NotFoundException('Bloqueo no encontrado');
  }

  async update(id: number, updateDto: UpdateSchedulerDto) {
    const block = await this.SchedulerRepository.findOneBy({ id });
    if (!block) throw new NotFoundException('Bloqueo no encontrado');

    if (updateDto.dateHour) {
      const start = new Date(updateDto.dateHour);
      const end = new Date(
        start.getTime() + (updateDto.estimatedDuration || block.estimatedDuration || 30) * 60000,
      );

      if (start >= end) {
        throw new BadRequestException('La fecha de inicio debe ser anterior a la de fin');
      }
    }

    Object.assign(block, updateDto);
    return await this.SchedulerRepository.save(block);
  }
}
