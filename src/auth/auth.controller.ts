import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { IsPublic } from './decorators/is-public.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthRequest } from './model/AuthRequest';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  // @IsPublic()
  // @Post('/recovery/:email')
  // async recovery(@Param('email') email: string) {
  //   return await this.authService.passwordRecoveryLink(email);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('recovery-password')
  async recoveryPassword(
    @Body() body: { password: string },
    @CurrentUser() user: User,
  ) {
    return await this.authService.recoveryPassword(user.email, body.password);
  }
}
