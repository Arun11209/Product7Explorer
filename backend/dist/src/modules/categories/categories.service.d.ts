import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../../schemas/category.schema';
import { ScrapingService } from '../scraping/scraping.service';
export declare class CategoriesService {
    private categoryModel;
    private scrapingService;
    constructor(categoryModel: Model<CategoryDocument>, scrapingService: ScrapingService);
    findAll(parentCategoryId?: string): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    findByNavigationHeading(navigationHeadingId: string): Promise<Category[]>;
    create(categoryData: Partial<Category>): Promise<Category>;
    update(id: string, categoryData: Partial<Category>): Promise<Category>;
    remove(id: string): Promise<void>;
    getCategoryTree(navigationHeadingId?: string): Promise<Category[]>;
    triggerScrape(categoryId?: string): Promise<{
        message: string;
        jobId?: string;
    }>;
}
