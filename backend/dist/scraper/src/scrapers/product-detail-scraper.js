"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeProductDetails = scrapeProductDetails;
const crawlee_1 = require("crawlee");
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    author: String,
    price: String,
    originalPrice: String,
    imageUrl: String,
    productUrl: { type: String, required: true },
    sourceId: { type: String, required: true, unique: true },
    categoryId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Category' },
    description: String,
    publisher: String,
    publicationDate: String,
    isbn: String,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    tags: [String],
    isAvailable: { type: Boolean, default: true },
    isScraped: { type: Boolean, default: false },
    lastScrapedAt: { type: Date, default: Date.now },
});
const ReviewSchema = new mongoose_1.default.Schema({
    productId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
    reviewerName: String,
    rating: Number,
    title: String,
    content: { type: String, required: true },
    reviewDate: String,
    isVerified: { type: Boolean, default: true },
});
const ProductModel = mongoose_1.default.model('Product', ProductSchema);
const ReviewModel = mongoose_1.default.model('Review', ReviewSchema);
async function scrapeProductDetails(productId) {
    const product = await ProductModel.findById(productId);
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
                const descriptionEl = body.querySelector('.description, .product-description, [data-testid*="description"]');
                const publisherEl = body.querySelector('.publisher, [data-testid*="publisher"]');
                const publicationDateEl = body.querySelector('.publication-date, [data-testid*="publication"]');
                const isbnEl = body.querySelector('.isbn, [data-testid*="isbn"]');
                return {
                    description: descriptionEl?.textContent?.trim(),
                    publisher: publisherEl?.textContent?.trim(),
                    publicationDate: publicationDateEl?.textContent?.trim(),
                    isbn: isbnEl?.textContent?.trim(),
                };
            });
            const reviews = await page.$$eval('.review, .review-item, [data-testid*="review"]', (reviewElements) => {
                return reviewElements.map((review) => {
                    const reviewerEl = review.querySelector('.reviewer, .author');
                    const ratingEl = review.querySelector('.rating, [data-testid*="rating"]');
                    const titleEl = review.querySelector('.review-title, h4');
                    const contentEl = review.querySelector('.review-content, .content');
                    const dateEl = review.querySelector('.review-date, .date');
                    return {
                        reviewerName: reviewerEl?.textContent?.trim(),
                        rating: ratingEl?.textContent?.trim() ? parseFloat(ratingEl.textContent.trim()) : undefined,
                        title: titleEl?.textContent?.trim(),
                        content: contentEl?.textContent?.trim(),
                        reviewDate: dateEl?.textContent?.trim(),
                        isVerified: true,
                    };
                }).filter(r => r.content);
            });
            await ProductModel.findByIdAndUpdate(productId, {
                ...productDetails,
                rating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length : undefined,
                reviewCount: reviews.length,
                isScraped: true,
                lastScrapedAt: new Date(),
            });
            for (const review of reviews) {
                try {
                    await ReviewModel.findOneAndUpdate({ productId, content: review.content }, {
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
        console.error(`Error during product details scraping: ${error}`);
        return { success: false, reviewsCount: 0 };
    }
}
//# sourceMappingURL=product-detail-scraper.js.map