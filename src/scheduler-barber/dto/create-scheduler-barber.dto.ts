import { IsInt, IsString, IsBoolean, IsOptional, Min, Max, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchedulerBarberDto {
  @ApiProperty({ example: 1, description: 'ID del barbero' })
  @IsInt()
  barberId: number;

  @ApiProperty({ example: 1, description: 'Día de la semana (0 = Domingo, 1 = Lunes, etc.)' })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ example: '09:00', description: 'Hora de inicio en formato HH:mm' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'El formato de hora debe ser HH:mm' })
  startTime: string;

  @ApiProperty({ example: '18:00', description: 'Hora de fin en formato HH:mm' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'El formato de hora debe ser HH:mm' })
  endTime: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
