import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @Post('/create')
  async createUser(
    @Body() body: { email: string; name: string; password: string },
  ) {
    return await this.usersService.createUser(
      body.email,
      body.name,
      body.password,
    );
  }
}
