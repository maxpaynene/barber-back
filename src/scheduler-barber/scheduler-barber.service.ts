import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { SchedulerBarber } from './entities/scheduler-barber.entity';
import { CreateSchedulerBarberDto } from './dto/create-scheduler-barber.dto';
import { UpdateSchedulerBarberDto } from './dto/update-scheduler-barber.dto';

@Injectable()
export class SchedulerBarberService {
  constructor(
    @InjectRepository(SchedulerBarber)
    private readonly scheduleRepository: Repository<SchedulerBarber>,
  ) {}

  async findAll() {
    return await this.scheduleRepository.find({ where: { isActive: true } });
  }

  async findAllByBarber(barberId: number) {
    return await this.scheduleRepository.find({
      where: { barberId, isActive: true },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async create(createDto: CreateSchedulerBarberDto) {
    // Validación de solapamiento (Conflict) similar a tu validación de email
    const overlappingSchedule = await this.scheduleRepository.findOne({
      where: {
        barberId: createDto.barberId,
        dayOfWeek: createDto.dayOfWeek,
        isActive: true,
        // Lógica simplificada de choque de horas
        startTime: LessThan(createDto.endTime),
        endTime: MoreThan(createDto.startTime),
      },
    });

    if (overlappingSchedule) {
      throw new ConflictException('El barbero ya tiene un horario que se solapa en este rango');
    }

    const newSchedule = this.scheduleRepository.create(
      createDto as Partial<CreateSchedulerBarberDto>,
    );
    return await this.scheduleRepository.save(newSchedule);
  }

  async update(id: number, updateData: UpdateSchedulerBarberDto) {
    const schedule = await this.scheduleRepository.findOneBy({ id });
    if (!schedule) throw new NotFoundException('Horario no encontrado');

    // Usamos Object.assign como en tu ejemplo de Users
    Object.assign(schedule, updateData);
    return await this.scheduleRepository.save(schedule);
  }

  async delete(id: number) {
    const schedule = await this.scheduleRepository.findOneBy({ id });
    if (!schedule) throw new NotFoundException('Horario no encontrado');

    // Desactivamos el flag y aplicamos softDelete de TypeORM
    await this.scheduleRepository.update(id, { isActive: false });
    return await this.scheduleRepository.softDelete(id);
  }
}
