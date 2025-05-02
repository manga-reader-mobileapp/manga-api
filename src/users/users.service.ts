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
}
