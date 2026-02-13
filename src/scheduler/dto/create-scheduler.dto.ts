import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSchedulerDto {
  @ApiProperty({ example: 1, description: 'ID del barbero asignado' })
  @IsInt()
  @IsNotEmpty()
  barberId: number;

  @ApiProperty({ example: 1, description: 'ID del cliente que reserva' })
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({ example: 1, description: 'ID del servicio solicitado' })
  @IsInt()
  @IsNotEmpty()
  serviceId: number;

  @ApiProperty({ example: '2024-03-20T13:00:00Z', description: 'Fecha y hora de la cita' })
  @IsDateString()
  @IsNotEmpty()
  dateHour: string;

  @ApiPropertyOptional({ example: 30, description: 'Duración en minutos' })
  @IsInt()
  @IsOptional()
  estimatedDuration?: number;

  @ApiPropertyOptional({ example: 15000, description: 'Precio final del servicio' })
  @IsInt()
  @IsOptional()
  finalCost?: number;

  @ApiProperty({
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    example: 'pending',
    default: 'pending',
  })
  @IsEnum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 'Corte degradado con barba', description: 'Notas adicionales' })
  @IsString()
  @IsOptional()
  barberNotes?: string;
}
