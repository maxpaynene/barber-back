import { IsBoolean, IsIn, IsInt, IsString, Matches, Min } from 'class-validator';

export class UpdateBarberDefaultScheduleDto {
  @IsInt()
  @Min(0)
  @IsIn([0, 1, 2, 3, 4, 5, 6])
  dayOfWeek: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'startTime debe tener formato HH:mm o HH:mm:ss',
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'endTime debe tener formato HH:mm o HH:mm:ss',
  })
  endTime: string;

  @IsBoolean()
  isActive: boolean;
}
