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
import { User } from 'src/users/entities/user.entity';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll(@CurrentUser() user: User) {
    return await this.categoryService.findAll(user.id);
  }

  @Delete(':id')
  async delete(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.categoryService.delete(id, user.id);
  }

  @Put(':id')
  async edit(@Body() body: { name: string }, @Param('id') id: string) {
    return await this.categoryService.edit(id, body.name);
  }

  @Post()
  async create(@CurrentUser() user: User) {
    return await this.categoryService.create(user.id);
  }

  @Post('/modify-order')
  async modifyOrder(@Body() body: { id: string; newPosition: number }[]) {
    return await this.categoryService.modifyOrder(body);
  }
}
