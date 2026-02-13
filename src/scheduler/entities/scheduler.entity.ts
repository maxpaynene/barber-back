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
import { User } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';

@Entity('Scheduler')
export class Scheduler {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'barber_id', nullable: true })
  barberId: number;

  @Column({ name: 'client_id', nullable: true })
  clientId: number;

  @Column({ name: 'service_id', nullable: true })
  serviceId: number;

  @Column({ name: 'date_hour', type: 'datetime' })
  dateHour: Date;

  @Column({ name: 'estimated_duration', nullable: true })
  estimatedDuration: number;

  @Column({ name: 'final_cost', nullable: true })
  finalCost: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    default: 'pending',
  })
  status: string;

  @Column({ name: 'barber_notes', type: 'text', nullable: true })
  barberNotes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => Barber)
  @JoinColumn({ name: 'barber_id' })
  barber: Barber;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
