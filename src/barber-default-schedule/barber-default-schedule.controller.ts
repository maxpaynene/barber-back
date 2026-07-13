import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BarberDefaultScheduleService } from './barber-default-schedule.service';
import { UpdateBarberDefaultScheduleBulkDto } from './dto/update-barber-default-schedule-bulk.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLE } from '../common/roles.constants';

@ApiTags('barber-default-schedule')
@Controller('barber-default-schedule')
export class BarberDefaultScheduleController {
  constructor(private readonly service: BarberDefaultScheduleService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener la pauta de horarios por defecto para nuevos barberos' })
  findAll() {
    return this.service.findAll();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reemplazar la pauta completa de horarios por defecto' })
  updateBulk(@Body() dto: UpdateBarberDefaultScheduleBulkDto) {
    return this.service.updateBulk(dto);
  }
}
