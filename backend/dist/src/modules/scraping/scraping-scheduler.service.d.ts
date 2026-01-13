import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { ScrapingService } from './scraping.service';
import { ProductDocument } from '../../schemas/product.schema';
export declare class ScrapingSchedulerService implements OnModuleInit {
    private readonly scrapingService;
    private productModel;
    private readonly logger;
    private isRunning;
    private hasRunStartup;
    constructor(scrapingService: ScrapingService, productModel: Model<ProductDocument>);
    handleAutoScrapeProducts(): Promise<void>;
    onModuleInit(): Promise<void>;
}
