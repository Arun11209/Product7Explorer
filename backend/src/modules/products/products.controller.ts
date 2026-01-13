import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import type { ProductQuery, PaginatedProducts } from './products.service';
import { Product } from '../../schemas/product.schema';
import { Review } from '../../schemas/review.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: ProductQuery): Promise<PaginatedProducts> {
    return this.productsService.findAll(query);
  }

  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: Omit<ProductQuery, 'categoryId'>,
  ): Promise<PaginatedProducts> {
    return this.productsService.findByCategory(categoryId, query);
  }

  @Get('search')
  async search(
    @Query('q') searchTerm: string,
    @Query() query: Omit<ProductQuery, 'search'>,
  ): Promise<PaginatedProducts> {
    return this.productsService.search(searchTerm, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Get(':id/related')
  async getRelatedProducts(
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ): Promise<Product[]> {
    return this.productsService.getRelatedProducts(id, limit);
  }

  @Get(':id/reviews')
  async getReviews(@Param('id') id: string): Promise<Review[]> {
    return this.productsService.getReviews(id);
  }

  @Post(':id/reviews')
  async createReview(
    @Param('id') productId: string,
    @Body() reviewData: Partial<Review>,
  ): Promise<Review> {
    return this.productsService.createReview(productId, reviewData);
  }

  @Post()
  async create(@Body() productData: Partial<Product>): Promise<Product> {
    return this.productsService.create(productData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() productData: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.update(id, productData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }

  @Post('scrape')
  async triggerScrape(@Query('productId') productId?: string): Promise<{ message: string; jobId?: string }> {
    return this.productsService.triggerScrape(productId);
  }

  @Post('create-mock-reviews')
  async createMockReviews(): Promise<{ message: string }> {
    await this.productsService.createMockReviews();
    return { message: 'Mock reviews created successfully' };
  }
}
