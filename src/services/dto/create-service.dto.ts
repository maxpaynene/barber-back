import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Nombre del servicio',
    example: 'Corte de cabello',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @ApiPropertyOptional({
    description: 'Descripción del servicio',
    example: 'Corte de cabello con máquina y tijera',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  descripcion?: string;

  @ApiProperty({
    description: 'Precio del servicio en la moneda local',
    example: 150,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precio!: number;

  @ApiPropertyOptional({
    description: 'Duración estimada del servicio en minutos',
    example: 30,
    minimum: 1,
    default: 30,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  duracion_minutos?: number;

  @ApiPropertyOptional({
    description: 'Estado del servicio (activo/inactivo)',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
