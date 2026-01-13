import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { NavigationHeadingDocument, CategoryDocument, ProductDocument, ReviewDocument } from '../../schemas';
export declare class ScrapingService {
    private configService;
    private navigationModel;
    private categoryModel;
    private productModel;
    private reviewModel;
    private readonly logger;
    private readonly baseUrl;
    constructor(configService: ConfigService, navigationModel: Model<NavigationHeadingDocument>, categoryModel: Model<CategoryDocument>, productModel: Model<ProductDocument>, reviewModel: Model<ReviewDocument>);
    scrapeNavigationHeadings(): Promise<{
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
