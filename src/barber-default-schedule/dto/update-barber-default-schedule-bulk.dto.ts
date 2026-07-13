import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateBarberDefaultScheduleDto } from './update-barber-default-schedule.dto';

export class UpdateBarberDefaultScheduleBulkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBarberDefaultScheduleDto)
  items: UpdateBarberDefaultScheduleDto[];
}
