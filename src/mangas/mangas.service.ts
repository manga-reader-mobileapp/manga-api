import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class MangasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByCategoryId(categoryId: string, userId: string) {
    const mangas = await this.prisma.savedManga.findMany({
      where: {
        categoryId,
        userId,
      },
      select: {
        manga: {
          select: {
            id: true,
            title: true,
            description: true,
            img: true,
            url: true,
            chapters: true,
            source: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },
    });

    return mangas.map((manga) => {
      return {
        id: manga.manga.id,
        title: manga.manga.title,
        description: manga.manga.description,
        img: manga.manga.img,
        chapters: manga.manga.chapters,
        source: manga.manga.source.id,
        sourceUrl: manga.manga.source.url,
        url: manga.manga.url,
      };
    });
  }

  async findUniqueManga(id: string, userId: string) {
    const manga = await this.prisma.manga.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        img: true,
        url: true,
        chapters: true,
        History: {
          where: {
            userId,
          },
          select: {
            chapter: true,
          },
        },
        source: {
          select: {
            id: true,
            url: true,
            name: true,
          },
        },
        SavedManga: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!manga) {
      throw new Error('Manga not found');
    }

    return {
      title: manga.title,
      description: manga.description,
      img: manga.img,
      url: manga.url,
      chapters: manga.chapters,
      source: manga.source.id,
      sourceName: manga.source.name,
      sourceUrl: manga.source.url,
      isFavorite: manga.SavedManga.length > 0,
      ...(manga.History && manga.History[0]
        ? { lastChapter: manga.History[0].chapter }
        : {}),
    };
  }

  async getInfosPages(sourceId: string, mangaUrl: string) {
    const manga = await this.prisma.manga.findFirst({
      where: {
        source: {
          name: sourceId,
        },
        url: mangaUrl,
      },
      select: {
        chapters: true,
        title: true,
        source: {
          select: {
            url: true,
          },
        },
      },
    });
    if (!manga) {
      throw new Error('Manga not found');
    }
    return {
      chapters: manga.chapters,
      title: manga.title,
      url: manga.source.url,
    };
  }

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
    data: {
      title: string;
      description: string;
      img: string;
      chapters: string;
    },
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
        description: data.description,
        img: data.img,
        chapters: Number(data.chapters),
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
