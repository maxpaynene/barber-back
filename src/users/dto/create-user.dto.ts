import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsString,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Perez', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'Requerido si no se envía googleId',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 'https://foto.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: '+56 9 1234 5678', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiProperty({
    example: 3,
    description: 'ID del rol (1=admin, 2=barber, 3=client)',
    default: 3,
  })
  @IsInt()
  @Min(1)
  rol_id!: number;

  @ApiPropertyOptional({ description: 'ID de Google (si viene de OAuth)' })
  @IsOptional()
  @IsString()
  google_id?: string;
}