import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/PrismaModule';
import { MangasController } from './mangas.controller';
import { MangasService } from './mangas.service';

@Module({
  imports: [PrismaModule],
  providers: [MangasService],
  controllers: [MangasController],
})
export class MangasModule {}
