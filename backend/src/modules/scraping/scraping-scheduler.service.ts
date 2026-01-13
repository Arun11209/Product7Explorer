import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScrapingService } from './scraping.service';
import { Product, ProductDocument } from '../../schemas/product.schema';

@Injectable()
export class ScrapingSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(ScrapingSchedulerService.name);
  private isRunning = false;
  private hasRunStartup = false;

  constructor(
    private readonly scrapingService: ScrapingService,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  /**
   * Automatically scrape products every day at 2:00 AM
   * Cron format: second minute hour day month day-of-week
   * '0 0 2 * * *' = Every day at 2:00 AM
   * 
   * To change the schedule, modify the cron expression:
   * - Every day at 2 AM: '0 0 2 * * *'
   * - Every 6 hours: '0 0 /6 * * *' (use / instead of *)
   * - Every hour: '0 0 * * * *'
   * - Every 30 minutes: '0 /30 * * * *' (use / instead of *)
   */
  @Cron('0 0 2 * * *', {
    name: 'autoScrapeProducts',
    timeZone: 'UTC',
  })
  async handleAutoScrapeProducts() {
    if (this.isRunning) {
      this.logger.warn('Scraping already in progress, skipping scheduled run');
      return;
    }

    this.logger.log('=== Starting automatic product scraping (scheduled) ===');
    this.isRunning = true;

    try {
      // Step 1: Scrape navigation headings (if needed)
      const navResult = await this.scrapingService.scrapeNavigationHeadings();
      this.logger.log(`Navigation headings: ${navResult.count} items`);

      // Step 2: Scrape categories (if needed)
      const catResult = await this.scrapingService.scrapeCategories();
      this.logger.log(`Categories: ${catResult.count} items`);

      // Step 3: Scrape products
      const productResult = await this.scrapingService.scrapeProducts(undefined, 50);
      this.logger.log(`Products: ${productResult.count} items scraped`);

      this.logger.log('=== Automatic scraping completed successfully ===');
    } catch (error) {
      this.logger.error('Error during automatic scraping:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Scrape on application startup (runs once when server starts)
   * This ensures you have data immediately when the server starts
   */
  async onModuleInit() {
    if (this.hasRunStartup) {
      return;
    }

    this.logger.log('=== Running initial scrape on server startup ===');
    this.hasRunStartup = true;
    this.isRunning = true;

    try {
      // Wait a bit for database connection to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if we already have products
      const existingProducts = await this.productModel.countDocuments();
      
      if (existingProducts === 0) {
        this.logger.log('No products found, running initial scrape...');
        
        // Step 1: Scrape navigation headings
        const navResult = await this.scrapingService.scrapeNavigationHeadings();
        this.logger.log(`Navigation headings: ${navResult.count} items`);

        // Step 2: Scrape categories
        const catResult = await this.scrapingService.scrapeCategories();
        this.logger.log(`Categories: ${catResult.count} items`);

        // Step 3: Scrape products (limit to 10 for startup)
        const productResult = await this.scrapingService.scrapeProducts(undefined, 10);
        this.logger.log(`Products: ${productResult.count} items scraped on startup`);
      } else {
        this.logger.log(`Database already has ${existingProducts} products, skipping startup scrape`);
      }
    } catch (error) {
      this.logger.error('Error during startup scrape:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Optional: Scrape products every hour (for testing/development)
   * Uncomment this if you want more frequent scraping
   */
  // @Cron(CronExpression.EVERY_HOUR, {
  //   name: 'autoScrapeProductsHourly',
  // })
  // async handleAutoScrapeProductsHourly() {
  //   if (this.isRunning) {
  //     this.logger.warn('Scraping already in progress, skipping hourly run');
  //     return;
  //   }

  //   this.logger.log('=== Starting hourly product scraping ===');
  //   this.isRunning = true;

  //   try {
  //     const result = await this.scrapingService.scrapeProducts(undefined, 20);
  //     this.logger.log(`Hourly scraping: ${result.count} products added`);
  //   } catch (error) {
  //     this.logger.error('Error during hourly scraping:', error);
  //   } finally {
  //     this.isRunning = false;
  //   }
  // }
}

