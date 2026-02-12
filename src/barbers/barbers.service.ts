import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barber } from './entities/barber.entity';
import { User } from '../users/entities/user.entity';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';

@Injectable()
export class BarbersService {
  constructor(
    @InjectRepository(Barber)
    private barberRepository: Repository<Barber>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createBarberDto: CreateBarberDto) {
    // 1. Validar que el usuario existe
    const user = await this.userRepository.findOneBy({ id: createBarberDto.userId });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // 2. Validar que el usuario no sea ya un barbero
    const existingBarber = await this.barberRepository.findOneBy({ userId: user.id });
    if (existingBarber) throw new ConflictException('Este usuario ya es un barbero');

    // 3. Crear el barbero
    const newBarber = this.barberRepository.create(createBarberDto);

    // 4. Actualizar el rol del usuario a 'barbero' (ID 2)
    user.rol_id = 2;
    await this.userRepository.save(user);

    return await this.barberRepository.save(newBarber);
  }

  async findAll() {
    return await this.barberRepository.find({
      where: { active: true },
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const barber = await this.barberRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!barber) throw new NotFoundException('Barbero no encontrado');
    return barber;
  }

  async remove(id: number) {
    const barber = await this.barberRepository.findOneBy({ id });
    if (!barber) throw new NotFoundException('Barbero no encontrado');

    // En lugar de eliminar, marcamos como inactivo
    barber.active = false;
    await this.barberRepository.save(barber);
  }

  async update(id: number, updateBarberDto: Partial<UpdateBarberDto>) {
    const barber = await this.barberRepository.findOneBy({ id });
    if (!barber) throw new NotFoundException('Barbero no encontrado');

    // Si se intenta cambiar el usuario, validar que el nuevo usuario existe y no es ya un barbero
    if (updateBarberDto.userId && updateBarberDto.userId !== barber.userId) {
      const newUser = await this.userRepository.findOneBy({ id: updateBarberDto.userId });
      if (!newUser) throw new NotFoundException('Nuevo usuario no encontrado');

      const existingBarber = await this.barberRepository.findOneBy({ userId: newUser.id });
      if (existingBarber) throw new ConflictException('El nuevo usuario ya es un barbero');

      // Actualizar el rol del nuevo usuario a 'barbero'
      newUser.rol_id = 2;
      await this.userRepository.save(newUser);

      // Opcional: Si quieres revertir el rol del usuario anterior a 'cliente' (ID 1)
      const oldUser = await this.userRepository.findOneBy({ id: barber.userId });
      if (oldUser) {
        oldUser.rol_id = 1;
        await this.userRepository.save(oldUser);
      }
    }

    // Actualizar los campos del barbero
    Object.assign(barber, updateBarberDto);
    return await this.barberRepository.save(barber);
  }
}
