import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapingController } from './scraping.controller';
import { ScrapingService } from './scraping.service';
import { ScrapingSchedulerService } from './scraping-scheduler.service';
import {
  NavigationHeading,
  NavigationHeadingSchema,
  Category,
  CategorySchema,
  Product,
  ProductSchema,
  Review,
  ReviewSchema,
} from '../../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NavigationHeading.name, schema: NavigationHeadingSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [ScrapingController],
  providers: [ScrapingService, ScrapingSchedulerService],
  exports: [ScrapingService],
})
export class ScrapingModule {}
