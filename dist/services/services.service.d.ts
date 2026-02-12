import { Repository } from 'typeorm';
import { Service as ServiceEntity } from './entities/service.entity';
export declare class ServicesService {
    private readonly serviceRepository;
    constructor(serviceRepository: Repository<ServiceEntity>);
    findAllActive(): Promise<ServiceEntity[]>;
    create(data: Partial<ServiceEntity>): Promise<ServiceEntity>;
    update(id: number, data: Partial<ServiceEntity>): Promise<ServiceEntity>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
