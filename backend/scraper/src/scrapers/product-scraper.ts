import { PlaywrightCrawler } from 'crawlee';
import mongoose from 'mongoose';

// Define interfaces for the data
interface Product {
  title: string;
  author?: string;
  price?: string;
  originalPrice?: string;
  imageUrl?: string;
  productUrl: string;
  sourceId: string;
  categoryId?: mongoose.Types.ObjectId;
  description?: string;
  publisher?: string;
  publicationDate?: string;
  isbn?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  isAvailable: boolean;
  isScraped: boolean;
  lastScrapedAt: Date;
}

interface Category {
  _id: mongoose.Types.ObjectId;
  name: string;
  url: string;
  navigationHeadingId?: mongoose.Types.ObjectId;
  isActive: boolean;
}

// Simple schemas for standalone scraper
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  price: String,
  originalPrice: String,
  imageUrl: String,
  productUrl: { type: String, required: true },
  sourceId: { type: String, required: true, unique: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
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

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  navigationHeadingId: { type: mongoose.Schema.Types.ObjectId, ref: 'NavigationHeading' },
  isActive: { type: Boolean, default: true },
  lastScrapedAt: { type: Date, default: Date.now },
});

const ProductModel = mongoose.model('Product', ProductSchema);
const CategoryModel = mongoose.model('Category', CategorySchema);

export async function scrapeProducts(categoryId?: string, limit = 50): Promise<{ success: boolean; count: number }> {
  // Get categories to scrape
  const categories = categoryId
    ? [await CategoryModel.findById(categoryId)]
    : await CategoryModel.find({ isActive: true }).limit(5); // Limit to avoid overwhelming

  const crawler = new PlaywrightCrawler({
    maxConcurrency: 2,
    navigationTimeoutSecs: 30,
    requestHandlerTimeoutSecs: 60,
  });

  const products: Partial<Product>[] = [];

  for (const category of categories) {
    if (!category) continue;

    crawler.router.addDefaultHandler(async ({ page, log }) => {
      log.info(`Scraping products for category ${category.name}`);

      try {
        await page.waitForLoadState('networkidle');

        // Extract products - adjust selectors based on World of Books structure
        const pageProducts = await page.$$eval(
          '.product-item, .book-item, [data-testid*="product"], .product-card',
          (items) => {
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
                } as Partial<Product>;
            }).filter(p => p.title && p.productUrl);
          }
        );

        // Set categoryId for each product
        pageProducts.forEach(product => {
          product.categoryId = category._id;
        });

        products.push(...pageProducts);
        log.info(`Found ${pageProducts.length} products for ${category.name}`);
      } catch (error) {
        log.error(`Error scraping products for ${category.name}:`, error);
      }
    });

    try {
      await crawler.run([category.url]);
    } catch (error) {
      console.error(`Error crawling ${category.url}:`, error);
    }

    if (products.length >= limit) break;
  }

  // Save to database
  let savedCount = 0;
  for (const product of products.slice(0, limit)) {
    try {
      if (product.productUrl && !product.productUrl.startsWith('http')) {
        product.productUrl = `https://www.worldofbooks.com${product.productUrl}`;
      }

      await ProductModel.findOneAndUpdate(
        { sourceId: product.sourceId },
        {
          ...product,
          isAvailable: true,
          lastScrapedAt: new Date(),
        },
        { upsert: true, new: true }
      );
      savedCount++;
    } catch (error) {
      console.error(`Error saving product ${product.title}:`, error);
    }
  }

  console.log(`Successfully scraped and saved ${savedCount} products`);
  return { success: true, count: savedCount };
}
