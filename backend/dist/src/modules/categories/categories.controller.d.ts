import { CategoriesService } from './categories.service';
import { Category } from '../../schemas/category.schema';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(parentCategoryId?: string): Promise<Category[]>;
    findByNavigationHeading(navigationHeadingId: string): Promise<Category[]>;
    getCategoryTree(navigationHeadingId?: string): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    create(categoryData: Partial<Category>): Promise<Category>;
    update(id: string, categoryData: Partial<Category>): Promise<Category>;
    remove(id: string): Promise<void>;
    triggerScrape(categoryId?: string): Promise<{
        message: string;
        jobId?: string;
    }>;
}
