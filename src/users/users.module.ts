import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  providers: [PrismaService, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
