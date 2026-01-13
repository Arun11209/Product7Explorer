"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ScrapingSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const scraping_service_1 = require("./scraping.service");
const product_schema_1 = require("../../schemas/product.schema");
let ScrapingSchedulerService = ScrapingSchedulerService_1 = class ScrapingSchedulerService {
    scrapingService;
    productModel;
    logger = new common_1.Logger(ScrapingSchedulerService_1.name);
    isRunning = false;
    hasRunStartup = false;
    constructor(scrapingService, productModel) {
        this.scrapingService = scrapingService;
        this.productModel = productModel;
    }
    async handleAutoScrapeProducts() {
        if (this.isRunning) {
            this.logger.warn('Scraping already in progress, skipping scheduled run');
            return;
        }
        this.logger.log('=== Starting automatic product scraping (scheduled) ===');
        this.isRunning = true;
        try {
            const navResult = await this.scrapingService.scrapeNavigationHeadings();
            this.logger.log(`Navigation headings: ${navResult.count} items`);
            const catResult = await this.scrapingService.scrapeCategories();
            this.logger.log(`Categories: ${catResult.count} items`);
            const productResult = await this.scrapingService.scrapeProducts(undefined, 50);
            this.logger.log(`Products: ${productResult.count} items scraped`);
            this.logger.log('=== Automatic scraping completed successfully ===');
        }
        catch (error) {
            this.logger.error('Error during automatic scraping:', error);
        }
        finally {
            this.isRunning = false;
        }
    }
    async onModuleInit() {
        if (this.hasRunStartup) {
            return;
        }
        this.logger.log('=== Running initial scrape on server startup ===');
        this.hasRunStartup = true;
        this.isRunning = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const existingProducts = await this.productModel.countDocuments();
            if (existingProducts === 0) {
                this.logger.log('No products found, running initial scrape...');
                const navResult = await this.scrapingService.scrapeNavigationHeadings();
                this.logger.log(`Navigation headings: ${navResult.count} items`);
                const catResult = await this.scrapingService.scrapeCategories();
                this.logger.log(`Categories: ${catResult.count} items`);
                const productResult = await this.scrapingService.scrapeProducts(undefined, 10);
                this.logger.log(`Products: ${productResult.count} items scraped on startup`);
            }
            else {
                this.logger.log(`Database already has ${existingProducts} products, skipping startup scrape`);
            }
        }
        catch (error) {
            this.logger.error('Error during startup scrape:', error);
        }
        finally {
            this.isRunning = false;
        }
    }
};
exports.ScrapingSchedulerService = ScrapingSchedulerService;
__decorate([
    (0, schedule_1.Cron)('0 0 2 * * *', {
        name: 'autoScrapeProducts',
        timeZone: 'UTC',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScrapingSchedulerService.prototype, "handleAutoScrapeProducts", null);
exports.ScrapingSchedulerService = ScrapingSchedulerService = ScrapingSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [scraping_service_1.ScrapingService,
        mongoose_2.Model])
], ScrapingSchedulerService);
//# sourceMappingURL=scraping-scheduler.service.js.map