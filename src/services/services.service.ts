import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service as ServiceEntity } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
  ) {}

  async findAllActive() {
    return await this.serviceRepository.find({ where: { activo: true } });
  }

  async create(data: Partial<ServiceEntity>) {
    const newService = this.serviceRepository.create(data);
    return await this.serviceRepository.save(newService);
  }

  async update(id: number, data: Partial<ServiceEntity>) {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service) throw new NotFoundException('Servicio no encontrado');
    Object.assign(service, data);
    return await this.serviceRepository.save(service);
  }

  async remove(id: number) {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service) throw new NotFoundException('Servicio no encontrado');
    await this.serviceRepository.softDelete(id);
    return { message: 'Servicio eliminado exitosamente' };
  }
}
