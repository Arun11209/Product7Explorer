"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeNavigationHeadings = scrapeNavigationHeadings;
const crawlee_1 = require("crawlee");
const mongoose_1 = __importDefault(require("mongoose"));
const NavigationHeadingSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    lastScrapedAt: { type: Date, default: Date.now },
});
const NavigationHeadingModel = mongoose_1.default.model('NavigationHeading', NavigationHeadingSchema);
async function scrapeNavigationHeadings() {
    const baseUrl = process.env.WORLD_OF_BOOKS_BASE_URL || 'https://www.worldofbooks.com';
    const crawler = new crawlee_1.PlaywrightCrawler({
        maxConcurrency: 1,
        navigationTimeoutSecs: 30,
        requestHandlerTimeoutSecs: 60,
    });
    const navigationHeadings = [];
    crawler.router.addDefaultHandler(async ({ page, log }) => {
        log.info('Scraping navigation headings from World of Books');
        try {
            await page.waitForLoadState('networkidle');
            const headings = await page.$$eval('nav a, .navigation a, header a[href*="/categories"]', (anchors) => {
                return anchors
                    .map((a) => {
                    const href = a.getAttribute('href');
                    const text = a.textContent?.trim();
                    if (href && text && text.length > 0 && href.includes('/categories')) {
                        return {
                            name: text,
                            url: href.startsWith('http') ? href : `https://www.worldofbooks.com${href}`,
                        };
                    }
                    return null;
                })
                    .filter(Boolean)
                    .slice(0, 10);
            });
            const uniqueHeadings = headings.filter(heading => heading !== null).reduce((acc, heading) => {
                if (!acc.some(h => h.name === heading.name)) {
                    acc.push(heading);
                }
                return acc;
            }, []);
            navigationHeadings.push(...uniqueHeadings);
            log.info(`Found ${uniqueHeadings.length} navigation headings`);
        }
        catch (error) {
            log.error('Error scraping navigation headings:', error);
        }
    });
    try {
        await crawler.run([baseUrl]);
        let savedCount = 0;
        for (const heading of navigationHeadings) {
            try {
                await NavigationHeadingModel.findOneAndUpdate({ name: heading.name }, {
                    ...heading,
                    isActive: true,
                    lastScrapedAt: new Date(),
                }, { upsert: true, new: true });
                savedCount++;
            }
            catch (error) {
                console.error(`Error saving navigation heading ${heading.name}:`, error);
            }
        }
        console.log(`Successfully scraped and saved ${savedCount} navigation headings`);
        return { success: true, count: savedCount };
    }
    catch (error) {
        console.error('Error during navigation headings scraping:', error);
        return { success: false, count: 0 };
    }
}
//# sourceMappingURL=navigation-scraper.js.map