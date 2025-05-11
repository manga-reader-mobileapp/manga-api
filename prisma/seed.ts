import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

async function main() {
  const prisma = new PrismaService();

  const sources = [
    {
      name: 'manga-livre',
      url: 'https://mangalivre.tv',
      title: 'Manga Livre',
    },
    {
      name: 'ler-mangas',
      url: 'https://lermangas.me',
      title: 'Ler Mangas',
    },
    {
      name: 'br-mangas',
      url: 'https://flowermanga.net',
      title: 'Br Mangas',
    },
    {
      name: 'seita-celestial',
      url: 'https://seitacelestial.com',
      title: 'Seita Celestial',
    },
    {
      name: 'manga-dex',
      url: 'https://api.mangadex.org',
      title: 'MangaDex',
    },
  ];

  for (const source of sources) {
    const exist = await prisma.source.findFirst({
      where: {
        name: source.name,
      },
    });

    if (exist) {
      await prisma.source.update({
        where: {
          name: source.name,
        },
        data: {
          url: source.url,
          title: source.title,
        },
      });
      continue;
    }

    await prisma.source.create({
      data: {
        name: source.name,
        url: source.url,
      },
    });
  }

  const exist = await prisma.user.findFirst({
    where: {
      email: 'seu@email.com',
    },
  });

  if (exist) return;

  await prisma.user.create({
    data: {
      email: 'seu@email.com',
      name: 'Principal',
      isActive: true,
      password: '$2a$10$cWS6wPC0Ulcjm1WhvPplXuPUAnVNlKoVLdvGsKoqYrFlPbMY4u41.', // 1234
    },
  });

  await prisma.category.create({
    data: {
      name: 'Default',
      orderKanban: 0,
      user: {
        connect: {
          id: exist.id,
        },
      },
    },
  });
}

main();
