import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { SourceModule } from './source/source.module';
import { MangasModule } from './mangas/mangas.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [UsersModule, AuthModule, CategoryModule, SourceModule, MangasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
