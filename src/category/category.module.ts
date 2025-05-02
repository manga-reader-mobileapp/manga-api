import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaModule } from 'src/database/PrismaModule';

@Module({
  imports: [PrismaModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
