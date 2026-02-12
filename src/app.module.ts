import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from './services/services.module';
import { Service } from './services/entities/service.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Role } from './roles/entities/role.entity';
import { RolesModule } from './roles/roles.module';
import { Barber } from './barbers/entities/barber.entity';
import { BarbersModule } from './barbers/barbers.module';
import { SchedulerBlock } from './scheduler-block/entities/scheduler-blocks.entity';
import { SchedulerBlocksModule } from './scheduler-block/scheduler-blocks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Service, User, Role, Barber, SchedulerBlock],
        synchronize: true,
        logging: true,
      }),
    }),
    ServicesModule,
    UsersModule,
    RolesModule,
    BarbersModule,
    SchedulerBlocksModule,
  ],
})
export class AppModule {}
