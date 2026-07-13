import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SchedulerBlocksService } from './scheduler-blocks.service';
import { CreateSchedulerBlockDto } from './dto/create-scheduler-block.dto';
import { UpdateSchedulerBlockDto } from './dto/update-scheduler-block.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLE } from '../common/roles.constants';

@ApiTags('scheduler-block')
@Controller('scheduler-blocks')
export class SchedulerBlocksController {
  constructor(private readonly blocksService: SchedulerBlocksService) {}

  @Get('barber/:id')
  @ApiOperation({ summary: 'Listar bloqueos de un barbero específico' })
  findByBarber(@Param('id', ParseIntPipe) id: number) {
    return this.blocksService.findByBarber(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.BARBER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un bloqueo por ID' })
  @ApiResponse({ status: 200, description: 'Bloqueo encontrado' })
  @ApiResponse({ status: 404, description: 'Bloqueo no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blocksService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.BARBER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bloquear un rango de tiempo para un barbero' })
  create(@Body() createDto: CreateSchedulerBlockDto) {
    return this.blocksService.create(createDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.BARBER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un bloqueo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blocksService.remove(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.BARBER)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateSchedulerBlockDto })
  @ApiOperation({ summary: 'Actualizar un bloqueo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateSchedulerBlockDto) {
    return this.blocksService.update(id, updateDto);
  }
}
