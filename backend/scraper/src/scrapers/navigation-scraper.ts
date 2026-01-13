import { PlaywrightCrawler, Dataset } from 'crawlee';
import mongoose from 'mongoose';

// Define interfaces for the data
interface NavigationHeading {
  name: string;
  url: string;
  isActive: boolean;
  lastScrapedAt: Date;
}

// Simple schema for standalone scraper
const NavigationHeadingSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  lastScrapedAt: { type: Date, default: Date.now },
});

const NavigationHeadingModel = mongoose.model('NavigationHeading', NavigationHeadingSchema);

export async function scrapeNavigationHeadings(): Promise<{ success: boolean; count: number }> {
  const baseUrl = process.env.WORLD_OF_BOOKS_BASE_URL || 'https://www.worldofbooks.com';

  const crawler = new PlaywrightCrawler({
    maxConcurrency: 1,
    navigationTimeoutSecs: 30,
    requestHandlerTimeoutSecs: 60,
  });

  const navigationHeadings: Partial<NavigationHeading>[] = [];

  crawler.router.addDefaultHandler(async ({ page, log }) => {
    log.info('Scraping navigation headings from World of Books');

    try {
      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Extract navigation headings - adjust selectors based on World of Books structure
      const headings = await page.$$eval(
        'nav a, .navigation a, header a[href*="/categories"]', // Common selectors for navigation
        (anchors) => {
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
            .slice(0, 10); // Limit to avoid duplicates
        }
      );

      // Process and deduplicate headings
      const uniqueHeadings = headings.filter(heading => heading !== null).reduce((acc, heading) => {
        if (!acc.some(h => h.name === heading!.name)) {
          acc.push(heading!);
        }
        return acc;
      }, [] as NonNullable<typeof headings[0]>[]);

      navigationHeadings.push(...uniqueHeadings);

      log.info(`Found ${uniqueHeadings.length} navigation headings`);
    } catch (error) {
      log.error('Error scraping navigation headings:', error);
    }
  });

  try {
    await crawler.run([baseUrl]);

    // Save to database
    let savedCount = 0;
    for (const heading of navigationHeadings) {
      try {
        await NavigationHeadingModel.findOneAndUpdate(
          { name: heading.name },
          {
            ...heading,
            isActive: true,
            lastScrapedAt: new Date(),
          },
          { upsert: true, new: true }
        );
        savedCount++;
      } catch (error) {
        console.error(`Error saving navigation heading ${heading.name}:`, error);
      }
    }

    console.log(`Successfully scraped and saved ${savedCount} navigation headings`);
    return { success: true, count: savedCount };
  } catch (error) {
    console.error('Error during navigation headings scraping:', error);
    return { success: false, count: 0 };
  }
}
