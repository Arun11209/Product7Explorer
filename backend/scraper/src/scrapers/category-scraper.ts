import { PlaywrightCrawler } from 'crawlee';
import mongoose from 'mongoose';

// Define interfaces for the data
interface Category {
  name: string;
  url: string;
  navigationHeadingId?: mongoose.Types.ObjectId;
  isActive: boolean;
  lastScrapedAt: Date;
}

interface NavigationHeading {
  _id: mongoose.Types.ObjectId;
  name: string;
  url: string;
  isActive: boolean;
}

// Simple schemas for standalone scraper
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  navigationHeadingId: { type: mongoose.Schema.Types.ObjectId, ref: 'NavigationHeading' },
  isActive: { type: Boolean, default: true },
  lastScrapedAt: { type: Date, default: Date.now },
});

const NavigationHeadingSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  lastScrapedAt: { type: Date, default: Date.now },
});

const CategoryModel = mongoose.model('Category', CategorySchema);
const NavigationHeadingModel = mongoose.model('NavigationHeading', NavigationHeadingSchema);

export async function scrapeCategories(navigationHeadingId?: string): Promise<{ success: boolean; count: number }> {
  // Get navigation headings to scrape
  const headings = navigationHeadingId
    ? [await NavigationHeadingModel.findById(navigationHeadingId)]
    : await NavigationHeadingModel.find({ isActive: true });

  const crawler = new PlaywrightCrawler({
    maxConcurrency: 2,
    navigationTimeoutSecs: 30,
    requestHandlerTimeoutSecs: 60,
  });

  const categories: Partial<Category>[] = [];

  for (const heading of headings) {
    if (!heading) continue;

    crawler.router.addDefaultHandler(async ({ page, log, request }) => {
      log.info(`Scraping categories for ${heading.name}`);

      try {
        await page.waitForLoadState('networkidle');

        // Extract categories - adjust selectors based on World of Books structure
        const pageCategories = await page.$$eval(
          '.category-list a, .categories a, [data-testid*="category"] a, .sidebar a[href*="/categories/"]',
          (anchors) => {
            return anchors
              .map((a) => {
                const href = a.getAttribute('href');
                const text = a.textContent?.trim();

                if (href && text && text.length > 0) {
                  return {
                    name: text,
                    url: href.startsWith('http') ? href : `https://www.worldofbooks.com${href}`,
                  } as Partial<Category>;
                }
                return null;
              })
              .filter(Boolean);
          }
        );

        // Set navigationHeadingId for each category
        pageCategories.forEach(cat => {
          if (cat) cat.navigationHeadingId = heading._id;
        });

        categories.push(...pageCategories.filter(cat => cat !== null));
        log.info(`Found ${pageCategories.length} categories for ${heading.name}`);
      } catch (error) {
        log.error(`Error scraping categories for ${heading.name}:`, error);
      }
    });

    try {
      await crawler.run([heading.url]);
    } catch (error) {
      console.error(`Error crawling ${heading.url}:`, error);
    }
  }

  // Save to database
  let savedCount = 0;
  for (const category of categories) {
    try {
      await CategoryModel.findOneAndUpdate(
        { name: category.name, navigationHeadingId: category.navigationHeadingId },
        {
          ...category,
          isActive: true,
          lastScrapedAt: new Date(),
        },
        { upsert: true, new: true }
      );
      savedCount++;
    } catch (error) {
      console.error(`Error saving category ${category.name}:`, error);
    }
  }

  console.log(`Successfully scraped and saved ${savedCount} categories`);
  return { success: true, count: savedCount };
}
