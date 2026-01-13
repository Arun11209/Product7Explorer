import { ScrapingService } from './scraping.service';
export declare class ScrapingController {
    private readonly scrapingService;
    constructor(scrapingService: ScrapingService);
    scrapeNavigation(): Promise<{
        success: boolean;
        count: number;
    }>;
    scrapeCategories(navigationHeadingId?: string): Promise<{
        success: boolean;
        count: number;
    }>;
    scrapeProducts(categoryId?: string, limit?: number): Promise<{
        success: boolean;
        count: number;
    }>;
    scrapeProductDetails(productId: string): Promise<{
        success: boolean;
        reviewsCount: number;
    }>;
}
