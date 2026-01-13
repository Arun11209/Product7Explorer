"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeCategories = scrapeCategories;
const crawlee_1 = require("crawlee");
const mongoose_1 = __importDefault(require("mongoose"));
const CategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    navigationHeadingId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'NavigationHeading' },
    isActive: { type: Boolean, default: true },
    lastScrapedAt: { type: Date, default: Date.now },
});
const NavigationHeadingSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    lastScrapedAt: { type: Date, default: Date.now },
});
const CategoryModel = mongoose_1.default.model('Category', CategorySchema);
const NavigationHeadingModel = mongoose_1.default.model('NavigationHeading', NavigationHeadingSchema);
async function scrapeCategories(navigationHeadingId) {
    const headings = navigationHeadingId
        ? [await NavigationHeadingModel.findById(navigationHeadingId)]
        : await NavigationHeadingModel.find({ isActive: true });
    const crawler = new crawlee_1.PlaywrightCrawler({
        maxConcurrency: 2,
        navigationTimeoutSecs: 30,
        requestHandlerTimeoutSecs: 60,
    });
    const categories = [];
    for (const heading of headings) {
        if (!heading)
            continue;
        crawler.router.addDefaultHandler(async ({ page, log, request }) => {
            log.info(`Scraping categories for ${heading.name}`);
            try {
                await page.waitForLoadState('networkidle');
                const pageCategories = await page.$$eval('.category-list a, .categories a, [data-testid*="category"] a, .sidebar a[href*="/categories/"]', (anchors) => {
                    return anchors
                        .map((a) => {
                        const href = a.getAttribute('href');
                        const text = a.textContent?.trim();
                        if (href && text && text.length > 0) {
                            return {
                                name: text,
                                url: href.startsWith('http') ? href : `https://www.worldofbooks.com${href}`,
                            };
                        }
                        return null;
                    })
                        .filter(Boolean);
                });
                pageCategories.forEach(cat => {
                    if (cat)
                        cat.navigationHeadingId = heading._id;
                });
                categories.push(...pageCategories.filter(cat => cat !== null));
                log.info(`Found ${pageCategories.length} categories for ${heading.name}`);
            }
            catch (error) {
                log.error(`Error scraping categories for ${heading.name}:`, error);
            }
        });
        try {
            await crawler.run([heading.url]);
        }
        catch (error) {
            console.error(`Error crawling ${heading.url}:`, error);
        }
    }
    let savedCount = 0;
    for (const category of categories) {
        try {
            await CategoryModel.findOneAndUpdate({ name: category.name, navigationHeadingId: category.navigationHeadingId }, {
                ...category,
                isActive: true,
                lastScrapedAt: new Date(),
            }, { upsert: true, new: true });
            savedCount++;
        }
        catch (error) {
            console.error(`Error saving category ${category.name}:`, error);
        }
    }
    console.log(`Successfully scraped and saved ${savedCount} categories`);
    return { success: true, count: savedCount };
}
//# sourceMappingURL=category-scraper.js.map