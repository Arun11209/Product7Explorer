# Web Scraping Service

## Status: ✅ WORKING

The web scraping service is integrated and running automatically.

## Features Implemented

### ✅ Automated Scraping
- **Daily Schedule**: Runs automatically every day at 2:00 AM UTC
- **Startup Trigger**: Scrapes on server startup if database is empty
- **Manual Control**: API endpoints for on-demand scraping

### ✅ Data Sources
- **Primary Source**: World of Books website
- **Data Types**: Navigation, Categories, Products, Product Details
- **Mock Data**: Fallback data for testing and development

### ✅ Scraping Pipeline
1. **Navigation**: Extracts navigation headings from website
2. **Categories**: Scrapes category listings for each navigation
3. **Products**: Collects product information with pagination
4. **Details**: Gathers additional product metadata

### ✅ Product Data Collected
- **Basic Info**: Title, Author, Price, Original Price
- **Details**: Description, Publisher, Publication Date, ISBN
- **Ratings**: Rating score and review count
- **Images**: Book cover images from OpenLibrary API
- **Categories**: Product categorization
- **URLs**: Direct links to World of Books

### ✅ Technical Implementation
- **Framework**: Playwright for browser automation
- **Library**: Crawlee for scraping orchestration
- **Queue System**: Bull with Redis for job management
- **Scheduler**: NestJS Schedule for timed execution

### ✅ Error Handling
- **Robust Parsing**: Handles website changes gracefully
- **Fallback Data**: Mock products ensure functionality
- **Logging**: Comprehensive logging for monitoring
- **Retry Logic**: Automatic retries for failed requests

## Scraping Schedule
- **Daily**: 2:00 AM UTC (automatic)
- **Startup**: On server initialization (if needed)
- **Manual**: Via API endpoints `/scraping/*`

## API Endpoints
- `POST /scraping/navigation` - Scrape navigation headings
- `POST /scraping/categories` - Scrape categories
- `POST /scraping/products` - Scrape products
- `POST /scraping/products/:id/details` - Scrape product details

## Monitoring
- **Logs**: Scraping activities logged with timestamps
- **Progress**: Real-time progress tracking
- **Statistics**: Success/failure counts and timing

## Last Verified
- ✅ Scheduled scraping configured for 2:00 AM UTC daily
- ✅ Startup scraping runs on server initialization
- ✅ Manual scraping endpoints available via API
- ✅ Products successfully added to database
- ✅ Data displays correctly in frontend
- ✅ Mock data provides fallback functionality
- ✅ Error handling prevents crashes
- ✅ World of Books integration working

## Current Status
- **Automatic**: Daily scraping at 2:00 AM UTC
- **Startup**: Scrapes on server start (if DB empty)
- **Manual**: API endpoints for on-demand scraping
- **Products**: Mock data ensures immediate functionality
