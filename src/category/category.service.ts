import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(id: string) {
    return await this.prisma.category.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        orderKanban: 'asc',
      },
      select: {
        id: true,
        name: true,
        orderKanban: true,
        _count: {
          select: {
            SavedManga: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const mangas = await this.prisma.savedManga.findMany({
      where: { categoryId: id },
    });

    if (mangas.length > 0)
      throw new Error(
        'Não é possível deletar uma categoria com mangás associados',
      );

    return await this.prisma.category.delete({
      where: {
        id: id,
      },
    });
  }

  async edit(id: string, name: string) {
    return await this.prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
  }

  async create(name: string, userId: string) {
    const categories = await this.prisma.category.findMany({
      where: {
        userId: userId,
      },
    });

    const orderKanban = categories.length + 1;

    return await this.prisma.category.create({
      data: {
        name: name,
        orderKanban: orderKanban,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
