import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class SourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findUniqueSource(name: string) {
    return await this.prisma.source.findUnique({
      where: {
        name,
      },
    });
  }
}
