import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { SchedulerBlocksService } from './scheduler-blocks.service';
import { CreateSchedulerBlockDto } from './dto/create-scheduler-block.dto';
import { UpdateSchedulerBlockDto } from './dto/update-scheduler-block.dto';

@ApiTags('bloqueos-agenda')
@Controller('schedule-blocks')
export class SchedulerBlocksController {
  constructor(private readonly blocksService: SchedulerBlocksService) {}

  @Post()
  @ApiOperation({ summary: 'Bloquear un rango de tiempo para un barbero' })
  create(@Body() createDto: CreateSchedulerBlockDto) {
    return this.blocksService.create(createDto);
  }

  @Get('barber/:id')
  @ApiOperation({ summary: 'Listar bloqueos de un barbero específico' })
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.blocksService.findByBarber(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un bloqueo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blocksService.remove(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateSchedulerBlockDto })
  @ApiOperation({ summary: 'Actualizar un bloqueo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateSchedulerBlockDto) {
    return this.blocksService.update(id, updateDto);
  }
}
