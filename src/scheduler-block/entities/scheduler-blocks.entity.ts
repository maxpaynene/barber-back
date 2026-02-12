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

@Entity('scheduler_blocks')
export class SchedulerBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'barber_id' })
  barberId: number;

  @Column({ name: 'date_start' })
  date_start: Date;

  @Column({ name: 'date_end' })
  date_end: Date;

  @Column({
    type: 'enum',
    enum: ['lunch', 'holiday', 'leave', 'sick', 'other'],
    default: 'other',
  })
  reason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => Barber)
  @JoinColumn({ name: 'barber_id' })
  barber: Barber;
}
