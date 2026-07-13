import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';
import { SchedulerService } from './scheduler.service';
import { CreateSchedulerDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';

@ApiTags('scheduler')
@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cita' })
  create(@Body() createDto: CreateSchedulerDto) {
    return this.schedulerService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar citas (filtros opcionales por barbero y fecha)' })
  @ApiQuery({ name: 'barberId', required: false, type: Number })
  @ApiQuery({ name: 'date', required: false, type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'YYYY-MM-DD' })
  findAll(
    @Query('barberId') barberId?: string,
    @Query('date') date?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.schedulerService.findAll({
      barberId: barberId ? parseInt(barberId, 10) : undefined,
      date,
      from,
      to,
    });
  }

  @Get('barber/:barberId')
  @ApiOperation({ summary: 'Listar citas de un barbero específico' })
  findByBarber(@Param('barberId', ParseIntPipe) barberId: number) {
    return this.schedulerService.findAll({ barberId });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cita' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.schedulerService.remove(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateSchedulerDto })
  @ApiOperation({ summary: 'Actualizar una cita' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateSchedulerDto) {
    return this.schedulerService.update(id, updateDto);
  }
}
