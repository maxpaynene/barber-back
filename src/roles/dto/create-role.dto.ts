import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { FindOperator } from 'typeorm';

export class CreateRoleDto {
  @ApiProperty({ example: 'client', description: 'Nombre del rol' })
  @IsString()
  @IsNotEmpty()
  name: string | FindOperator<string>;
}
