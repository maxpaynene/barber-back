import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ROLE } from '../common/roles.constants';

const sanitizeUser = (user: User) => {
  const { password: _password, ...rest } = user;
  return rest;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find({
      where: { active: true },
      relations: ['rol'],
      order: { name: 'ASC' },
    });
    return users.map(sanitizeUser);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, active: true },
      relations: ['rol'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return sanitizeUser(user);
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) throw new ConflictException('El email ya está registrado');

    if (!createUserDto.password && !createUserDto.google_id) {
      throw new BadRequestException(
        'Se requiere password o google_id para crear el usuario',
      );
    }

    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, 10)
      : null;

    const newUser = this.userRepository.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: hashedPassword,
      avatar: createUserDto.avatar || null,
      phone: createUserDto.phone || null,
      google_id: createUserDto.google_id || null,
      rol_id: createUserDto.rol_id || ROLE.CLIENT,
    });
    const saved = await this.userRepository.save(newUser);
    return sanitizeUser(saved);
  }

  async update(id: number, updateData: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, 10);
    }
    if (updateData.name !== undefined) user.name = updateData.name;
    if (updateData.email !== undefined) {
      if (updateData.email !== user.email) {
        const existing = await this.userRepository.findOne({
          where: { email: updateData.email },
        });
        if (existing && existing.id !== id) {
          throw new ConflictException('El email ya está registrado');
        }
        user.email = updateData.email;
      }
    }
    if (updateData.avatar !== undefined) user.avatar = updateData.avatar;
    if (updateData.phone !== undefined) user.phone = updateData.phone;
    if (updateData.rol_id !== undefined) {
      const validRoles = Object.values(ROLE) as number[];
      if (!validRoles.includes(updateData.rol_id)) {
        throw new BadRequestException('rol_id inválido');
      }
      user.rol_id = updateData.rol_id;
    }
    if (updateData.active !== undefined) user.active = updateData.active;

    const saved = await this.userRepository.save(user);
    return sanitizeUser(saved);
  }

  async findOrCreateGoogleUser(googleData: any) {
    let user = await this.userRepository.findOne({
      where: [{ google_id: googleData.googleId as string }, { email: googleData.email as string }],
    });

    if (!user) {
      user = this.userRepository.create({
        google_id: googleData.googleId as string,
        email: googleData.email as string,
        rol_id: ROLE.CLIENT,
      });
      await this.userRepository.save(user);
    }
    return user;
  }

  async delete(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return await this.userRepository.softDelete(id);
  }
}
