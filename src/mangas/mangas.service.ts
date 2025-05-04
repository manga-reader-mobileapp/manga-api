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
            History: {
              select: {
                chapter: true,
              },
              where: {
                userId,
              },
            },
          },
        },
      },
    });

    return mangas.map((manga) => {
      const lastChapter = Number.isNaN(Number(manga.manga.History[0]?.chapter))
        ? 0
        : Number(manga.manga.History[0].chapter);

      const chapter = Number.isNaN(Number(manga.manga.chapters))
        ? 0
        : Number(manga.manga.chapters);

      const chapters = chapter - lastChapter;

      return {
        id: manga.manga.id,
        title: manga.manga.title,
        description: manga.manga.description,
        img: manga.manga.img,
        chapters,
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
            categoryId: true,
          },
          where: {
            userId,
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
      categoryId: manga.SavedManga[0].categoryId,
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
        id: true,
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
      id: manga.id,
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
        chapters: data.chapters,
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

  async updatedLastRead(
    mangaId: string,
    chapter: string,
    userId: string,
    forceUpdate: boolean,
  ) {
    const history = await this.prisma.history.findFirst({
      where: {
        mangaId,
        userId,
      },
      select: {
        chapter: true,
        id: true,
      },
    });

    if (!history) {
      await this.prisma.history.create({
        data: {
          mangaId,
          userId,
          chapter,
        },
      });

      return;
    }

    const lastChapter = Number.isNaN(Number(history.chapter))
      ? 0
      : Number(history.chapter);

    const numberChapter = Number.isNaN(Number(chapter)) ? 0 : Number(chapter);

    if (numberChapter < lastChapter && !forceUpdate) {
      return;
    }

    await this.prisma.history.update({
      where: {
        id: history.id,
      },
      data: {
        chapter: chapter,
      },
    });

    return;
  }

  async listHistory(userId: string) {
    try {
      // 1. Buscar todos os registros de histórico do usuário ordenados por data decrescente
      const historyRecords = await this.prisma.history.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          updated_at: 'desc',
        },
        include: {
          manga: true,
        },
      });

      // Se não houver registros, retorne um array vazio
      if (historyRecords.length === 0) {
        return [];
      }

      // 2. Agrupar registros por data (formato DD/MM/YYYY)
      const historyByDate = {};

      historyRecords.forEach((record) => {
        const date = new Date(record.updated_at);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const dateKey = `${day}/${month}/${year}`;

        // Extrair horário no formato HH:MM
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;

        // Se a data ainda não existir no objeto, crie um array vazio para ela
        if (!historyByDate[dateKey]) {
          historyByDate[dateKey] = [];
        }

        // Adicionar o registro ao array correspondente à data
        historyByDate[dateKey].push({
          id: record.id,
          manga: {
            id: record.manga.id,
            title: record.manga.title,
            img: record.manga.img,
          },
          chapter: record.chapter,
          time: timeStr,
          updated_at: record.updated_at,
        });
      });

      // 3. Converter o objeto agrupado em um array no formato esperado pela UI
      const formattedHistory = Object.entries(historyByDate).map(
        ([date, entries]) => {
          return {
            date,
            entries,
          };
        },
      );

      return formattedHistory;
    } catch (error) {
      console.error('Error fetching history:', error);
      throw new Error('Failed to fetch reading history');
    }
  }

  async updateCategory(data: string[], categoryId: string, userId: string) {
    await Promise.all(
      data.map((manga) =>
        this.prisma.savedManga.updateMany({
          where: {
            manga: {
              id: manga,
            },
            user: {
              id: userId,
            },
          },
          data: {
            categoryId: categoryId,
          },
        }),
      ),
    );
  }
}
