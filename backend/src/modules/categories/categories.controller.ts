import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from '../../schemas/category.schema';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(@Query('parentCategoryId') parentCategoryId?: string): Promise<Category[]> {
    return this.categoriesService.findAll(parentCategoryId);
  }

  @Get('navigation/:navigationHeadingId')
  async findByNavigationHeading(@Param('navigationHeadingId') navigationHeadingId: string): Promise<Category[]> {
    return this.categoriesService.findByNavigationHeading(navigationHeadingId);
  }

  @Get('tree')
  async getCategoryTree(@Query('navigationHeadingId') navigationHeadingId?: string): Promise<Category[]> {
    return this.categoriesService.getCategoryTree(navigationHeadingId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  async create(@Body() categoryData: Partial<Category>): Promise<Category> {
    return this.categoriesService.create(categoryData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() categoryData: Partial<Category>,
  ): Promise<Category> {
    return this.categoriesService.update(id, categoryData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }

  @Post('scrape')
  async triggerScrape(@Query('categoryId') categoryId?: string): Promise<{ message: string; jobId?: string }> {
    return this.categoriesService.triggerScrape(categoryId);
  }
}
