import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../schemas/product.schema';
import { Review, ReviewDocument } from '../../schemas/review.schema';
import { ScrapingService } from '../scraping/scraping.service';
export interface ProductQuery {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    sortBy?: 'title' | 'price' | 'rating' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
export interface PaginatedProducts {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare class ProductsService {
    private productModel;
    private reviewModel;
    private scrapingService;
    constructor(productModel: Model<ProductDocument>, reviewModel: Model<ReviewDocument>, scrapingService: ScrapingService);
    findAll(query?: ProductQuery): Promise<PaginatedProducts>;
    findOne(id: string): Promise<Product>;
    findByCategory(categoryId: string, query?: Omit<ProductQuery, 'categoryId'>): Promise<PaginatedProducts>;
    search(searchTerm: string, query?: Omit<ProductQuery, 'search'>): Promise<PaginatedProducts>;
    create(productData: Partial<Product>): Promise<Product>;
    update(id: string, productData: Partial<Product>): Promise<Product>;
    remove(id: string): Promise<void>;
    triggerScrape(productId?: string): Promise<{
        message: string;
        jobId?: string;
    }>;
    getRelatedProducts(productId: string, limit?: number): Promise<Product[]>;
    getReviews(productId: string): Promise<Review[]>;
    createReview(productId: string, reviewData: Partial<Review>): Promise<Review>;
    createMockReviews(): Promise<void>;
}
