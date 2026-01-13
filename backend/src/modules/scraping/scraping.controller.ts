import { Controller, Post, Query, Param } from '@nestjs/common';
import { ScrapingService } from './scraping.service';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('navigation')
  async scrapeNavigation() {
    return this.scrapingService.scrapeNavigationHeadings();
  }

  @Post('categories')
  async scrapeCategories(@Query('navigationHeadingId') navigationHeadingId?: string) {
    return this.scrapingService.scrapeCategories(navigationHeadingId);
  }

  @Post('products')
  async scrapeProducts(
    @Query('categoryId') categoryId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.scrapingService.scrapeProducts(categoryId, limit);
  }

  @Post('products/:productId/details')
  async scrapeProductDetails(@Param('productId') productId: string) {
    return this.scrapingService.scrapeProductDetails(productId);
  }
}
