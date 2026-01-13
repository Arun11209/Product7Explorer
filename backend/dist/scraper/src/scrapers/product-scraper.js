"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeProducts = scrapeProducts;
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
const CategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    navigationHeadingId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'NavigationHeading' },
    isActive: { type: Boolean, default: true },
    lastScrapedAt: { type: Date, default: Date.now },
});
const ProductModel = mongoose_1.default.model('Product', ProductSchema);
const CategoryModel = mongoose_1.default.model('Category', CategorySchema);
async function scrapeProducts(categoryId, limit = 50) {
    const categories = categoryId
        ? [await CategoryModel.findById(categoryId)]
        : await CategoryModel.find({ isActive: true }).limit(5);
    const crawler = new crawlee_1.PlaywrightCrawler({
        maxConcurrency: 2,
        navigationTimeoutSecs: 30,
        requestHandlerTimeoutSecs: 60,
    });
    const products = [];
    for (const category of categories) {
        if (!category)
            continue;
        crawler.router.addDefaultHandler(async ({ page, log }) => {
            log.info(`Scraping products for category ${category.name}`);
            try {
                await page.waitForLoadState('networkidle');
                const pageProducts = await page.$$eval('.product-item, .book-item, [data-testid*="product"], .product-card', (items) => {
                    return items.slice(0, 20).map((item) => {
                        const titleEl = item.querySelector('h3, .title, [data-testid*="title"]');
                        const authorEl = item.querySelector('.author, [data-testid*="author"]');
                        const priceEl = item.querySelector('.price, [data-testid*="price"]');
                        const imageEl = item.querySelector('img');
                        const linkEl = item.querySelector('a');
                        return {
                            title: titleEl?.textContent?.trim(),
                            author: authorEl?.textContent?.trim(),
                            price: priceEl?.textContent?.trim(),
                            imageUrl: imageEl?.getAttribute('src') || undefined,
                            productUrl: linkEl?.getAttribute('href') || undefined,
                            sourceId: linkEl?.getAttribute('href')?.split('/').pop(),
                            isAvailable: true,
                        };
                    }).filter(p => p.title && p.productUrl);
                });
                pageProducts.forEach(product => {
                    product.categoryId = category._id;
                });
                products.push(...pageProducts);
                log.info(`Found ${pageProducts.length} products for ${category.name}`);
            }
            catch (error) {
                log.error(`Error scraping products for ${category.name}:`, error);
            }
        });
        try {
            await crawler.run([category.url]);
        }
        catch (error) {
            console.error(`Error crawling ${category.url}:`, error);
        }
        if (products.length >= limit)
            break;
    }
    let savedCount = 0;
    for (const product of products.slice(0, limit)) {
        try {
            if (product.productUrl && !product.productUrl.startsWith('http')) {
                product.productUrl = `https://www.worldofbooks.com${product.productUrl}`;
            }
            await ProductModel.findOneAndUpdate({ sourceId: product.sourceId }, {
                ...product,
                isAvailable: true,
                lastScrapedAt: new Date(),
            }, { upsert: true, new: true });
            savedCount++;
        }
        catch (error) {
            console.error(`Error saving product ${product.title}:`, error);
        }
    }
    console.log(`Successfully scraped and saved ${savedCount} products`);
    return { success: true, count: savedCount };
}
//# sourceMappingURL=product-scraper.js.map