import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateSchedulerBlockDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  barberId: number;

  @ApiProperty({ example: '2024-03-20T13:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  date_start: string;

  @ApiProperty({ example: '2024-03-20T14:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  date_end: string;

  @ApiProperty({
    enum: ['lunch', 'holiday', 'leave', 'sick', 'other'],
    example: 'lunch',
  })
  @IsEnum(['lunch', 'holiday', 'leave', 'sick', 'other'])
  reason: string;
}
