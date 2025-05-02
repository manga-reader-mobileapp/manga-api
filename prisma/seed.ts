import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

async function main() {
  const prisma = new PrismaService();

  await prisma.user.create({
    data: {
      email: 'seu@email.com',
      name: 'Principal',
      isActive: true,
      password: '$2b$10$05oB1jvIoeT29lOHZ3k.p.JRTqILqhmOn9wUXddPKZMJfL3vlSwIm',
    },
  });
}

main();
