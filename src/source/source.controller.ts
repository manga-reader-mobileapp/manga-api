import { Controller, Get, Param } from '@nestjs/common';
import { SourceService } from './source.service';

@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get(':name')
  async findUniqueSource(@Param('name') name: string) {
    return await this.sourceService.findUniqueSource(name);
  }

  @Get()
  async findAllSources() {
    return await this.sourceService.findAllSources();
  }
}
