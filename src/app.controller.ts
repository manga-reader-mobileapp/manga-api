import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './auth/decorators/is-public.decorator';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPublic()
  @Get()
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Estamos no ar!</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
          }
          .message {
            text-align: center;
            font-size: 24px;
          }
          .emoji {
            font-size: 48px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="message">
          <div class="emoji">😊</div>
          Sem problemas por aqui!
        </div>
      </body>
      </html>
    `;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
