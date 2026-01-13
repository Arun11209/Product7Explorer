import { connectToMongoDB } from './utils/database';
import { scrapeNavigationHeadings } from './scrapers/navigation-scraper';
import { scrapeCategories } from './scrapers/category-scraper';
import { scrapeProducts } from './scrapers/product-scraper';
import { scrapeProductDetails } from './scrapers/product-detail-scraper';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    await connectToMongoDB();

    switch (command) {
      case 'navigation':
        console.log('Starting navigation headings scrape...');
        await scrapeNavigationHeadings();
        break;

      case 'categories':
        console.log('Starting categories scrape...');
        const navigationId = args[1];
        await scrapeCategories(navigationId);
        break;

      case 'products':
        console.log('Starting products scrape...');
        const categoryId = args[1];
        const limit = args[2] ? parseInt(args[2]) : 50;
        await scrapeProducts(categoryId, limit);
        break;

      case 'details':
        console.log('Starting product details scrape...');
        const productId = args[1];
        if (!productId) {
          console.error('Product ID required for details scrape');
          process.exit(1);
        }
        await scrapeProductDetails(productId);
        break;

      case 'all':
        console.log('Starting full scrape process...');
        console.log('1. Scraping navigation headings...');
        await scrapeNavigationHeadings();

        console.log('2. Scraping categories...');
        await scrapeCategories();

        console.log('3. Scraping products...');
        await scrapeProducts();

        console.log('Scrape process completed!');
        break;

      default:
        console.log('Usage:');
        console.log('  npm run scrape:nav');
        console.log('  npm run scrape:categories [navigationId]');
        console.log('  npm run scrape:products [categoryId] [limit]');
        console.log('  npm run scrape:details <productId>');
        console.log('  npm run dev all');
        process.exit(1);
    }

    console.log('Scrape completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Scrape failed:', error);
    process.exit(1);
  }
}

main();
