import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

async function main() {
  const prisma = new PrismaService();

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
}

main();
