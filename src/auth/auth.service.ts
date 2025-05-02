import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserPayload } from './model/UserPayload';
import { UserToken } from './model/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User): UserToken {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      acess_token: jwtToken,
      user: {
        ...user,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPassValid = await bcrypt.compare(password, user.password);

      if (isPassValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new Error('Email ou senha está incorreto.');
  }

  async recoveryPassword(email: string, password: string) {
    if (!email) return;

    await this.userService.changePassByUserId(email, password);

    return;
  }

  // async passwordRecoveryLink(email: string) {
  //   const user = await this.userService.findByEmail(email);

  //   if (!user) throw new HttpException('Usuário não encontrado', 404);

  //   if (!user.isActive) {
  //     throw new HttpException('user inactive', 403);
  //   }

  //   const recovery = this.jwtService.sign(
  //     {
  //       id: user.id,
  //       email: user.email,
  //       name: user.name,
  //     },
  //     { expiresIn: '20m' },
  //   );

  //   return;
  // }
}
