import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { MangasService } from './mangas.service';

@UseGuards(JwtAuthGuard)
@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) {}

  @Get('/:categoryId')
  async getAllByCategoryId(
    @Param('categoryId') categoryId: string,
    @CurrentUser() user: User,
  ) {
    return this.mangasService.findAllByCategoryId(categoryId, user.id);
  }

  @Get('/unique/:id')
  async getUniqueManga(@Param('id') id: string, @CurrentUser() user: User) {
    return this.mangasService.findUniqueManga(id, user.id);
  }

  @Get('/infos/:sourceId/:mangaUrl')
  async getInfosPages(
    @Param('sourceId') sourceId: string,
    @Param('mangaUrl') mangaUrl: string,
  ) {
    return this.mangasService.getInfosPages(sourceId, mangaUrl);
  }

  @Put('/last-chapter/:id')
  async updateLastChapter(
    @Param('id') id: string,
    @Body() body: { chapter: string },
  ) {
    return this.mangasService.updateLastChapter(id, body.chapter);
  }

  @Post('/favorited/:sourceId')
  async getAll(
    @Param('sourceId') sourceId: string,
    @Body() body: { url: string },
    @CurrentUser() user: User,
  ) {
    return this.mangasService.verifySavedManga(sourceId, body.url, user.id);
  }

  @Post('/favorite/:sourceId')
  async saveManga(
    @Param('sourceId') sourceId: string,
    @Body()
    body: {
      title: string;
      description: string;
      img: string;
      url: string;
      chapters: string;
    },
    @CurrentUser() user: User,
  ) {
    return this.mangasService.saveManga(body.url, sourceId, user.id, body);
  }

  @Post('favorite-saved/:mangaId')
  async createSavedManga(
    @Param('mangaId') mangaId: string,
    @CurrentUser() user: User,
  ) {
    return this.mangasService.createSavedManga(user.id, mangaId);
  }

  @Delete('/unfavorite/:sourceId')
  async deleteSavedManga(
    @Param('sourceId') sourceId: string,
    @Body() body: { url: string },
    @CurrentUser() user: User,
  ) {
    return this.mangasService.deleteSavedManga(sourceId, body.url, user.id);
  }

  @Post('/update-last-read/:mangaId/')
  async updatedLastRead(
    @Param('mangaId') mangaId: string,
    @CurrentUser() user: User,
    @Body() body: { chapter: string; forceUpdate?: boolean },
  ) {
    return this.mangasService.updatedLastRead(
      mangaId,
      body.chapter,
      user.id,
      body.forceUpdate,
    );
  }

  @Get('/all/history')
  async getHistory(@CurrentUser() user: User) {
    return this.mangasService.listHistory(user.id);
  }

  @Put('/update-category')
  async updateCategory(
    @Body() body: { mangaId: string[]; categoryId: string },
    @CurrentUser() user: User,
  ) {
    return this.mangasService.updateCategory(
      body.mangaId,
      body.categoryId,
      user.id,
    );
  }
}
