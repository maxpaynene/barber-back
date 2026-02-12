import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const existing = await this.roleRepository.findOne({
      where: { name: createRoleDto.name as string },
    });
    if (existing) throw new ConflictException('El rol ya existe');

    const newRole = this.roleRepository.create({ name: createRoleDto.name as string });
    return await this.roleRepository.save(newRole);
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async update(id: number, updateRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);

    const existing = await this.roleRepository.findOne({
      where: { name: updateRoleDto.name as string },
    });

    if (existing && existing.id !== id) throw new ConflictException('El rol ya existe');

    role.name = updateRoleDto.name as string;
    return await this.roleRepository.save(role);
  }

  async delete(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    await this.roleRepository.delete(id);
    return { message: `Rol con ID ${id} eliminado` };
  }
}
