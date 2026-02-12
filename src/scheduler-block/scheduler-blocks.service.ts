import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchedulerBlock } from './entities/scheduler-blocks.entity';
import { CreateSchedulerBlockDto } from './dto/create-scheduler-block.dto';
import { UpdateSchedulerBlockDto } from './dto/update-scheduler-block.dto';

@Injectable()
export class SchedulerBlocksService {
  constructor(
    @InjectRepository(SchedulerBlock)
    private readonly blockRepository: Repository<SchedulerBlock>,
  ) {}

  async create(createDto: CreateSchedulerBlockDto) {
    const start = new Date(createDto.date_start);
    const end = new Date(createDto.date_end);

    if (start >= end) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la de fin');
    }

    const block = this.blockRepository.create({
      ...createDto,
      date_start: start,
      date_end: end,
    });
    return await this.blockRepository.save(block);
  }

  async findAll() {
    return await this.blockRepository.find({ order: { date_start: 'ASC' } });
  }

  async findByBarber(barberId: number) {
    return await this.blockRepository.find({
      where: { barberId },
      order: { date_start: 'ASC' },
    });
  }

  async remove(id: number) {
    const block = await this.blockRepository.findOneBy({ id });
    if (!block) throw new NotFoundException('Bloqueo no encontrado');
    return await this.blockRepository.softDelete(id);
  }

  async update(id: number, updateDto: UpdateSchedulerBlockDto) {
    const block = await this.blockRepository.findOneBy({ id });
    if (!block) throw new NotFoundException('Bloqueo no encontrado');

    const start = new Date(updateDto.date_start);
    const end = new Date(updateDto.date_end);

    if (start >= end) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la de fin');
    }

    block.barberId = updateDto.barberId;
    block.date_start = start;
    block.date_end = end;
    block.reason = updateDto.reason;

    return await this.blockRepository.save(block);
  }
}
