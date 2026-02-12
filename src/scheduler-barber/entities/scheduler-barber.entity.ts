import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Barber } from '../../barbers/entities/barber.entity';

@Entity('scheduler_barber')
export class SchedulerBarber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'barber_id' })
  barberId: number;

  @Column({ name: 'day_of_week' })
  dayOfWeek: number;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => Barber, barbers => barbers.id)
  @JoinColumn({ name: 'barber_id' })
  barber: Barber;
}
