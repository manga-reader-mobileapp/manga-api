import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async changePassByUserId(email: string, newPass: string) {
    const hashedPass = await hash(newPass, 10);

    await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPass,
      },
    });

    return;
  }

  async createUser(email: string, name: string, password: string) {
    const hashedPass = await hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPass,
        isActive: false,
      },
      select: {
        id: true,
      },
    });

    await this.prisma.category.create({
      data: {
        name: 'Default',
        orderKanban: 0,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return;
  }
}
