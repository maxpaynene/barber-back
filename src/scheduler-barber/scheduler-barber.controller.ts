import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SchedulerBarberService } from './scheduler-barber.service';
import { CreateSchedulerBarberDto } from './dto/create-scheduler-barber.dto';
import { UpdateSchedulerBarberDto } from './dto/update-scheduler-barber.dto';

@ApiTags('barber-schedules')
@Controller('barber-schedules')
export class SchedulerBarberController {
  constructor(private readonly schedulerService: SchedulerBarberService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los horarios' })
  @ApiResponse({ status: 200, description: 'Lista de horarios' })
  getAll() {
    return this.schedulerService.findAll();
  }

  @Get('barber/:barberId')
  @ApiOperation({ summary: 'Obtener horarios de un barbero específico' })
  @ApiResponse({ status: 200, description: 'Lista de horarios del barbero' })
  getByBarber(@Param('barberId', ParseIntPipe) barberId: number) {
    return this.schedulerService.findAllByBarber(barberId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo bloque de horario' })
  @ApiBody({ type: CreateSchedulerBarberDto })
  @ApiResponse({ status: 201, description: 'Horario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o solapamiento de horario' })
  create(@Body() createDto: CreateSchedulerBarberDto) {
    return this.schedulerService.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un horario existente' })
  @ApiBody({ type: UpdateSchedulerBarberDto })
  @ApiResponse({ status: 200, description: 'Horario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateSchedulerBarberDto) {
    return this.schedulerService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un horario (soft delete)' })
  @ApiResponse({ status: 200, description: 'Horario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.schedulerService.delete(id);
  }
}
