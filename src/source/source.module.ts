import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { PrismaModule } from 'src/database/PrismaModule';

@Module({
  imports: [PrismaModule],
  providers: [SourceService],
  controllers: [SourceController],
})
export class SourceModule {}
