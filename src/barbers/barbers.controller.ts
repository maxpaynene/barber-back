import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { BarbersService } from './barbers.service';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';

@ApiTags('barbers')
@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @Post()
  @ApiOperation({ summary: 'Convertir un usuario existente en barbero' })
  create(@Body() createBarberDto: CreateBarberDto) {
    return this.barbersService.create(createBarberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de barberos activos' })
  findAll() {
    return this.barbersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un barbero por ID' })
  findOne(@Param('id') id: string) {
    return this.barbersService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un barbero por ID' })
  remove(@Param('id') id: string) {
    return this.barbersService.remove(+id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateBarberDto })
  @ApiOperation({ summary: 'Actualizar un barbero por ID' })
  update(@Param('id') id: string, @Body() updateBarberDto: Partial<UpdateBarberDto>) {
    return this.barbersService.update(+id, updateBarberDto);
  }
}
