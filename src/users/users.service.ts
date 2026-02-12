import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepository.find({ where: { active: true } });
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email as string },
    });

    if (existingUser) throw new ConflictException('El email ya está registrado');

    const newUser = this.userRepository.create(createUserDto as Partial<User>);
    return await this.userRepository.save(newUser);
  }

  async update(id: number, updateData: Partial<User>) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async findOrCreateGoogleUser(googleData: any) {
    let user = await this.userRepository.findOne({
      where: [{ google_id: googleData.googleId as string }, { email: googleData.email as string }],
    });

    if (!user) {
      user = this.userRepository.create({
        google_id: googleData.googleId as string,
        email: googleData.email as string,
        rol_id: 3,
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
