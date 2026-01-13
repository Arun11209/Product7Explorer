import { ProductsService } from './products.service';
import type { ProductQuery, PaginatedProducts } from './products.service';
import { Product } from '../../schemas/product.schema';
import { Review } from '../../schemas/review.schema';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: ProductQuery): Promise<PaginatedProducts>;
    findByCategory(categoryId: string, query: Omit<ProductQuery, 'categoryId'>): Promise<PaginatedProducts>;
    search(searchTerm: string, query: Omit<ProductQuery, 'search'>): Promise<PaginatedProducts>;
    findOne(id: string): Promise<Product>;
    getRelatedProducts(id: string, limit?: number): Promise<Product[]>;
    getReviews(id: string): Promise<Review[]>;
    createReview(productId: string, reviewData: Partial<Review>): Promise<Review>;
    create(productData: Partial<Product>): Promise<Product>;
    update(id: string, productData: Partial<Product>): Promise<Product>;
    remove(id: string): Promise<void>;
    triggerScrape(productId?: string): Promise<{
        message: string;
        jobId?: string;
    }>;
    createMockReviews(): Promise<{
        message: string;
    }>;
}
