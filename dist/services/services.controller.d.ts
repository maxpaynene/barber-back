import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    getAll(): Promise<import("./entities/service.entity").Service[]>;
    create(createServiceDto: CreateServiceDto): Promise<import("./entities/service.entity").Service>;
    update(id: number, updateServiceDto: UpdateServiceDto): Promise<import("./entities/service.entity").Service>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
