import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Perez' })
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'https://foto.jpg', required: false })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 1, description: 'ID del rol' })
  @IsNumber()
  rolId: number;

  @IsOptional()
  googleId?: string;
}
