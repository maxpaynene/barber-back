export interface User {
  id: number;
  google_id?: string | null;
  email: string;
  password?: string | null;
  name: string;
  avatar?: string | null;
  rol_id: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  rol?: Role;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

export interface CreateRoleDto {
  name: string;
}

export interface UpdateRoleDto {
  name?: string;
  active?: boolean;
}

export interface Barber {
  id: number;
  userId: number;
  biography: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  user?: User;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface SchedulerBlock {
  id: number;
  barberId: number;
  date_start: Date;
  date_end: Date;
  reason: 'lunch' | 'holiday' | 'leave' | 'sick' | 'other';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  barber?: Barber;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password?: string;
  google_id?: string;
  avatar?: string;
  rol_id?: number;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  password?: string;
  avatar?: string;
  rol_id?: number;
  active?: boolean;
}

export interface CreateBarberDto {
  user_id: number;
  biography?: string;
}

export interface UpdateBarberDto {
  biography?: string;
  active?: boolean;
}

export interface CreateServiceDto {
  name: string;
  description?: string;
  price: number;
  duration_minutes?: number;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  price?: number;
  duration_minutes?: number;
  active?: boolean;
}

export interface CreateSchedulerBlockDto {
  barber_id: number;
  date_start: Date;
  date_end: Date;
  reason?: 'lunch' | 'holiday' | 'leave' | 'sick' | 'other';
}

export interface UpdateSchedulerBlockDto {
  date_start?: Date;
  date_end?: Date;
  reason?: 'lunch' | 'holiday' | 'leave' | 'sick' | 'other';
}
