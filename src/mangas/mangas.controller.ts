import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { MangasService } from './mangas.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) {}

  @Post('/favorited/:sourceId')
  async getAll(
    @Param('sourceId') sourceId: string,
    @Body() body: { url: string },
    @CurrentUser('id') user: User,
  ) {
    console.log(body.url, sourceId, user.id);
    return this.mangasService.verifySavedManga(sourceId, body.url, user.id);
  }
}
