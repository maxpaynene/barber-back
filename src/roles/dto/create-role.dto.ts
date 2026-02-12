import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'client', description: 'Nombre del rol' })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
