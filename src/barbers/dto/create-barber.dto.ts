import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateBarberDto {
  @ApiProperty({ example: 1, description: 'ID del usuario que será barbero' })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 'Especialista en cortes urbanos.', required: false })
  @IsString()
  @IsOptional()
  biography?: string;
}
