import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { SchedulerService } from './scheduler.service';
import { CreateSchedulerDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';

@ApiTags('scheduler')
@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post()
  @ApiOperation({ summary: 'Bloquear un rango de tiempo para un barbero' })
  create(@Body() createDto: CreateSchedulerDto) {
    return this.schedulerService.create(createDto);
  }

  @Get('barber/:id')
  @ApiOperation({ summary: 'Listar bloqueos de un barbero específico' })
  findAll() {
    return this.schedulerService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un bloqueo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.schedulerService.remove(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateSchedulerDto })
  @ApiOperation({ summary: 'Actualizar un bloqueo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateSchedulerDto) {
    return this.schedulerService.update(id, updateDto);
  }
}
