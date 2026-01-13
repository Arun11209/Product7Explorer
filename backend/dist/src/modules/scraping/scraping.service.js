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
var ScrapingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const crawlee_1 = require("crawlee");
const schemas_1 = require("../../schemas");
let ScrapingService = ScrapingService_1 = class ScrapingService {
    configService;
    navigationModel;
    categoryModel;
    productModel;
    reviewModel;
    logger = new common_1.Logger(ScrapingService_1.name);
    baseUrl;
    constructor(configService, navigationModel, categoryModel, productModel, reviewModel) {
        this.configService = configService;
        this.navigationModel = navigationModel;
        this.categoryModel = categoryModel;
        this.productModel = productModel;
        this.reviewModel = reviewModel;
        this.baseUrl = this.configService.get('WORLD_OF_BOOKS_BASE_URL') || 'https://www.worldofbooks.com';
    }
    async scrapeNavigationHeadings() {
        this.logger.log('Starting navigation headings scrape (using mock data for testing)');
        const mockHeadings = [
            { name: 'Fiction', url: 'https://www.worldofbooks.com/en-gb/categories/fiction' },
            { name: 'Non-Fiction', url: 'https://www.worldofbooks.com/en-gb/categories/non-fiction' },
            { name: 'Children\'s Books', url: 'https://www.worldofbooks.com/en-gb/categories/childrens-books' },
            { name: 'Educational', url: 'https://www.worldofbooks.com/en-gb/categories/educational' },
            { name: 'Biography', url: 'https://www.worldofbooks.com/en-gb/categories/biography' },
        ];
        try {
            let savedCount = 0;
            for (const heading of mockHeadings) {
                try {
                    const result = await this.navigationModel.findOneAndUpdate({ name: heading.name }, { ...heading, isActive: true }, { upsert: true, new: true });
                    if (result) {
                        savedCount++;
                    }
                }
                catch (error) {
                    this.logger.error(`Error saving navigation heading ${heading.name}:`, error);
                }
            }
            this.logger.log(`Successfully scraped and saved ${savedCount} navigation headings (mock data)`);
            return { success: true, count: savedCount };
        }
        catch (error) {
            this.logger.error('Error during navigation headings scraping:', error);
            return { success: false, count: 0 };
        }
    }
    async scrapeCategories(navigationHeadingId) {
        this.logger.log('Starting categories scrape (using mock data for testing)');
        const headings = navigationHeadingId
            ? [await this.navigationModel.findById(navigationHeadingId)]
            : await this.navigationModel.find({ isActive: true });
        const mockCategories = [
            { name: 'Classic Literature', navigationHeadingId: headings[0]?._id, url: 'https://www.worldofbooks.com/en-gb/categories/fiction/classic-literature' },
            { name: 'Modern Fiction', navigationHeadingId: headings[0]?._id, url: 'https://www.worldofbooks.com/en-gb/categories/fiction/modern-fiction' },
            { name: 'Romance', navigationHeadingId: headings[0]?._id, url: 'https://www.worldofbooks.com/en-gb/categories/fiction/romance' },
            { name: 'Thrillers', navigationHeadingId: headings[0]?._id, url: 'https://www.worldofbooks.com/en-gb/categories/fiction/thrillers' },
            { name: 'History', navigationHeadingId: headings[1]?._id, url: 'https://www.worldofbooks.com/en-gb/categories/non-fiction/history' },
            { name: 'Science', navigationHeadingId: headings[1]?._id, url: 'https://www.worldofbooks.com/en-gb/categories/non-fiction/science' },
            { name: 'Biography', navigationHeadingId: headings[1]?._id, url: 'https://www.worldofbooks.com/en-gb/categories/non-fiction/biography' },
            { name: 'Self-Help', navigationHeadingId: headings[1]?._id, url: 'https://www.worldofbooks.com/en-gb/categories/non-fiction/self-help' },
            { name: 'Picture Books', navigationHeadingId: headings[2]?._id, url: 'https://www.worldofbooks.com/en-gb/categories/childrens-books/picture-books' },
            { name: 'Young Adult', navigationHeadingId: headings[2]?._id, url: 'https://www.worldofbooks.com/en-gb/categories/childrens-books/young-adult' },
            { name: 'Educational', navigationHeadingId: headings[2]?._id, url: 'https://www.worldofbooks.com/en-gb/categories/childrens-books/educational' },
        ];
        try {
            let savedCount = 0;
            for (const category of mockCategories) {
                try {
                    await this.categoryModel.findOneAndUpdate({ name: category.name, navigationHeadingId: category.navigationHeadingId }, {
                        ...category,
                        isActive: true,
                        lastScrapedAt: new Date(),
                    }, { upsert: true, new: true });
                    savedCount++;
                }
                catch (error) {
                    this.logger.error(`Error saving category ${category.name}:`, error);
                }
            }
            this.logger.log(`Successfully scraped and saved ${savedCount} categories (mock data)`);
            return { success: true, count: savedCount };
        }
        catch (error) {
            this.logger.error('Error during categories scraping:', error);
            return { success: false, count: 0 };
        }
    }
    async scrapeProducts(categoryId, limit = 50) {
        this.logger.log('Starting products scrape (using mock data for testing)');
        const categories = categoryId
            ? [await this.categoryModel.findById(categoryId)]
            : await this.categoryModel.find({ isActive: true }).limit(3);
        const mockProducts = [
            {
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                price: '£8.99',
                originalPrice: '£12.99',
                categoryId: categories[0]?._id,
                sourceId: '9780141182636',
                productUrl: 'https://www.worldofbooks.com/en-gb/search?q=The+Great+Gatsby+9780141182636',
                imageUrl: 'https://covers.openlibrary.org/b/isbn/9780141182636-L.jpg',
                description: 'A classic American novel set in the Jazz Age, following Nick Carraway\'s observations of his mysterious neighbor Jay Gatsby and his obsession with Daisy Buchanan.',
                publisher: 'Penguin Classics',
                publicationDate: '1925',
                isbn: '9780141182636',
                rating: 4.5,
                reviewCount: 1250,
                tags: ['fiction', 'classic', 'literature', 'american']
            },
            {
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                price: '£7.99',
                originalPrice: '£10.99',
                categoryId: categories[0]?._id,
                sourceId: '9780099419785',
                productUrl: 'https://www.worldofbooks.com/en-gb/search?q=To+Kill+a+Mockingbird+9780099419785',
                imageUrl: 'https://covers.openlibrary.org/b/isbn/9780099419785-L.jpg',
                description: 'A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.',
                publisher: 'Arrow Books',
                publicationDate: '1960',
                isbn: '9780099419785',
                rating: 4.8,
                reviewCount: 2100,
                tags: ['fiction', 'classic', 'literature', 'american']
            },
            {
                title: '1984',
                author: 'George Orwell',
                price: '£6.99',
                originalPrice: '£9.99',
                categoryId: categories[0]?._id,
                sourceId: '9780141036144',
                productUrl: 'https://www.worldofbooks.com/en-gb/search?q=1984+9780141036144',
                imageUrl: 'https://covers.openlibrary.org/b/isbn/9780141036144-L.jpg',
                description: 'A dystopian novel about totalitarian surveillance and thought control, following Winston Smith in a world of perpetual war and government surveillance.',
                publisher: 'Penguin Books',
                publicationDate: '1949',
                isbn: '9780141036144',
                rating: 4.6,
                reviewCount: 1800,
                tags: ['fiction', 'dystopian', 'classic', 'literature']
            },
            {
                title: 'Pride and Prejudice',
                author: 'Jane Austen',
                price: '£5.99',
                originalPrice: '£8.99',
                categoryId: categories[0]?._id,
                sourceId: '9780141439518',
                productUrl: 'https://www.worldofbooks.com/en-gb/search?q=Pride+and+Prejudice+9780141439518',
                imageUrl: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
                description: 'A romantic novel of manners that follows Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry.',
                publisher: 'Penguin Classics',
                publicationDate: '1813',
                isbn: '9780141439518',
                rating: 4.7,
                reviewCount: 1650,
                tags: ['fiction', 'romance', 'classic', 'literature']
            },
            {
                title: 'Sapiens: A Brief History of Humankind',
                author: 'Yuval Noah Harari',
                price: '£12.99',
                originalPrice: '£16.99',
                categoryId: categories[1]?._id,
                sourceId: '9780062316097',
                productUrl: 'https://www.worldofbooks.com/en-gb/search?q=Sapiens+9780062316097',
                imageUrl: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
                description: 'A groundbreaking narrative of humanity\'s creation and evolution that explores how biology and history have defined us and enhanced our understanding of what it means to be human.',
                publisher: 'Harper',
                publicationDate: '2014',
                isbn: '9780062316097',
                rating: 4.4,
                reviewCount: 3200,
                tags: ['non-fiction', 'history', 'science', 'anthropology']
            },
            {
                title: 'The Body Keeps the Score',
                author: 'Bessel van der Kolk',
                price: '£14.99',
                originalPrice: '£18.99',
                categoryId: categories[1]?._id,
                sourceId: '9780141978611',
                productUrl: 'https://www.worldofbooks.com/en-gb/search?q=The+Body+Keeps+the+Score+9780141978611',
                imageUrl: 'https://covers.openlibrary.org/b/isbn/9780141978611-L.jpg',
                description: 'A revolutionary book that explores how trauma reshapes both body and brain, compromising sufferers\' capacities for pleasure, engagement, self-control, and trust.',
                publisher: 'Penguin Books',
                publicationDate: '2014',
                isbn: '9780141978611',
                rating: 4.8,
                reviewCount: 4500,
                tags: ['non-fiction', 'psychology', 'health', 'trauma']
            },
            {
                title: 'The Very Hungry Caterpillar',
                author: 'Eric Carle',
                price: '£6.99',
                originalPrice: '£9.99',
                categoryId: categories[2]?._id,
                sourceId: '9780141339517',
                productUrl: 'https://www.worldofbooks.com/en-gb/search?q=The+Very+Hungry+Caterpillar+9780141339517',
                imageUrl: 'https://covers.openlibrary.org/b/isbn/9780141339517-L.jpg',
                description: 'A beloved children\'s classic that follows a very hungry caterpillar as it eats its way through various foods before transforming into a beautiful butterfly.',
                publisher: 'Puffin Books',
                publicationDate: '1969',
                isbn: '9780141339517',
                rating: 4.9,
                reviewCount: 2800,
                tags: ['children', 'picture-book', 'classic', 'educational']
            },
            {
                title: 'Where the Wild Things Are',
                author: 'Maurice Sendak',
                price: '£7.99',
                originalPrice: '£10.99',
                categoryId: categories[2]?._id,
                sourceId: '9780060254926',
                productUrl: 'https://www.worldofbooks.com/en-gb/search?q=Where+the+Wild+Things+Are+9780060254926',
                imageUrl: 'https://covers.openlibrary.org/b/isbn/9780060254926-L.jpg',
                description: 'A classic children\'s picture book about Max, a young boy who sails to an island inhabited by creatures known as the "Wild Things".',
                publisher: 'HarperCollins',
                publicationDate: '1963',
                isbn: '9780060254926',
                rating: 4.8,
                reviewCount: 1950,
                tags: ['children', 'picture-book', 'classic', 'adventure']
            },
        ];
        try {
            let savedCount = 0;
            const productsToSave = mockProducts.slice(0, limit);
            for (const product of productsToSave) {
                try {
                    await this.productModel.findOneAndUpdate({ sourceId: product.sourceId }, {
                        ...product,
                        isAvailable: true,
                        lastScrapedAt: new Date(),
                    }, { upsert: true, new: true });
                    savedCount++;
                }
                catch (error) {
                    this.logger.error(`Error saving product ${product.title}:`, error);
                }
            }
            this.logger.log(`Successfully scraped and saved ${savedCount} products (mock data)`);
            return { success: true, count: savedCount };
        }
        catch (error) {
            this.logger.error('Error during products scraping:', error);
            return { success: false, count: 0 };
        }
    }
    async scrapeProductDetails(productId) {
        this.logger.log(`Starting product details scrape for ${productId}`);
        const product = await this.productModel.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        const crawler = new crawlee_1.PlaywrightCrawler({
            maxConcurrency: 1,
            navigationTimeoutSecs: 30,
            requestHandlerTimeoutSecs: 60,
        });
        let reviewsCount = 0;
        crawler.router.addDefaultHandler(async ({ page, log }) => {
            log.info(`Scraping product details for ${product.title}`);
            try {
                await page.waitForLoadState('networkidle');
                const productDetails = await page.$eval('body', (body) => {
                    const descriptionEl = body.querySelector('.description, .product-description, [data-testid*="description"], .synopsis, .about, #description');
                    const publisherEl = body.querySelector('.publisher, [data-testid*="publisher"], .imprint, .published-by');
                    const publicationDateEl = body.querySelector('.publication-date, [data-testid*="publication"], .pub-date, .published');
                    const isbnEl = body.querySelector('.isbn, [data-testid*="isbn"], .isbn13, .isbn-13');
                    return {
                        description: descriptionEl?.textContent?.trim(),
                        publisher: publisherEl?.textContent?.trim(),
                        publicationDate: publicationDateEl?.textContent?.trim(),
                        isbn: isbnEl?.textContent?.trim(),
                    };
                });
                const reviews = await page.$$eval('.review, .review-item, [data-testid*="review"], .customer-review, .testimonial, .comment', (reviewElements) => {
                    return reviewElements.map((review) => {
                        const reviewerEl = review.querySelector('.reviewer, .author, .customer-name, .user');
                        const ratingEl = review.querySelector('.rating, [data-testid*="rating"], .stars, .rating-value');
                        const titleEl = review.querySelector('.review-title, h4, .title, .summary');
                        const contentEl = review.querySelector('.review-content, .content, .text, p');
                        const dateEl = review.querySelector('.review-date, .date, .posted, .timestamp');
                        const content = contentEl?.textContent?.trim();
                        if (!content || content.length < 10)
                            return null;
                        let rating;
                        const ratingText = ratingEl?.textContent?.trim();
                        if (ratingText) {
                            const match = ratingText.match(/(\d+(\.\d+)?)/);
                            if (match)
                                rating = parseFloat(match[1]);
                        }
                        return {
                            reviewerName: reviewerEl?.textContent?.trim() || 'Anonymous',
                            rating,
                            title: titleEl?.textContent?.trim(),
                            content,
                            reviewDate: dateEl?.textContent?.trim(),
                            isVerified: true,
                        };
                    }).filter(Boolean);
                });
                const validReviews = reviews.filter((r) => r !== null && !!r.content);
                await this.productModel.findByIdAndUpdate(productId, {
                    ...productDetails,
                    rating: validReviews.length > 0 ? validReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / validReviews.length : undefined,
                    reviewCount: validReviews.length,
                    isScraped: true,
                    lastScrapedAt: new Date(),
                });
                for (const review of validReviews) {
                    try {
                        await this.reviewModel.findOneAndUpdate({ productId, content: review.content }, {
                            productId,
                            ...review,
                        }, { upsert: true, new: true });
                        reviewsCount++;
                    }
                    catch (error) {
                        log.error(`Error saving review: ${error}`);
                    }
                }
                log.info(`Updated product details and saved ${reviewsCount} reviews`);
            }
            catch (error) {
                log.error(`Error scraping product details: ${error}`);
            }
        });
        try {
            await crawler.run([product.productUrl]);
            return { success: true, reviewsCount };
        }
        catch (error) {
            this.logger.error(`Error during product details scraping: ${error}`);
            return { success: false, reviewsCount: 0 };
        }
    }
};
exports.ScrapingService = ScrapingService;
exports.ScrapingService = ScrapingService = ScrapingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(schemas_1.NavigationHeading.name)),
    __param(2, (0, mongoose_1.InjectModel)(schemas_1.Category.name)),
    __param(3, (0, mongoose_1.InjectModel)(schemas_1.Product.name)),
    __param(4, (0, mongoose_1.InjectModel)(schemas_1.Review.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ScrapingService);
//# sourceMappingURL=scraping.service.js.map