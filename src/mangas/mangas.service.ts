import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class MangasService {
  constructor(private readonly prisma: PrismaService) {}

  async createSavedManga(userId: string, mangaId: string) {
    const categoryId = await this.prisma.category.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
      },
      orderBy: {
        orderKanban: 'asc',
      },
    });

    return await this.prisma.savedManga.create({
      data: {
        manga: {
          connect: {
            id: mangaId,
          },
        },
        category: {
          connect: {
            id: categoryId.id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async saveManga(
    url: string,
    sourceId: string,
    userId: string,
    data: { title: string; author: string; description: string; img: string },
  ) {
    const manga = await this.prisma.manga.findFirst({
      where: {
        url,
        sourceId,
      },
      select: {
        id: true,
      },
    });

    if (manga) {
      await this.createSavedManga(userId, manga.id);

      return;
    }

    const source = await this.prisma.source.findUnique({
      where: {
        id: sourceId,
      },
      select: {
        id: true,
      },
    });

    if (!source) {
      throw new Error('Source not found');
    }

    const mangaId = await this.prisma.manga.create({
      data: {
        title: data.title,
        author: data.author,
        description: data.description,
        img: data.img,
        url,
        source: {
          connect: {
            id: source.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    await this.createSavedManga(userId, mangaId.id);
  }

  async findAllByCategoryId(categoryId: string) {
    return await this.prisma.savedManga.findMany({
      where: {
        categoryId,
      },
      select: {
        id: true,
        manga: {
          select: {
            id: true,
            title: true,
            description: true,
            img: true,
            chapters: true,
            source: {
              select: {
                url: true,
              },
            },
          },
        },
      },
    });
  }

  async verifySavedManga(sourceId: string, url: string, userId: string) {
    const savedManga = await this.prisma.savedManga.findFirst({
      where: {
        userId,
        manga: {
          url: url,
          sourceId: sourceId,
        },
      },
      select: {
        id: true,
      },
    });

    console.log(savedManga);

    if (!savedManga) {
      return {
        isFavorite: false,
      };
    }

    return {
      isFavorite: true,
    };
  }

  async deleteSavedManga(sourceId: string, url: string, userId: string) {
    return await this.prisma.savedManga.deleteMany({
      where: {
        userId,
        manga: {
          url: url,
          sourceId: sourceId,
        },
      },
    });
  }
}
