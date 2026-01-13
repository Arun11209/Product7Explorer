import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../schemas/product.schema';
import { Review, ReviewDocument } from '../../schemas/review.schema';
import { ScrapingService } from '../scraping/scraping.service';

export interface ProductQuery {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  sortBy?: 'title' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
    @Inject(forwardRef(() => ScrapingService))
    private scrapingService: ScrapingService,
  ) {}

  async findAll(query: ProductQuery = {}): Promise<PaginatedProducts> {
    const {
      categoryId,
      search,
      minPrice,
      maxPrice,
      isAvailable = true,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const filter: any = { isAvailable };

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      products,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findByCategory(categoryId: string, query: Omit<ProductQuery, 'categoryId'> = {}): Promise<PaginatedProducts> {
    return this.findAll({ ...query, categoryId });
  }

  async search(searchTerm: string, query: Omit<ProductQuery, 'search'> = {}): Promise<PaginatedProducts> {
    return this.findAll({ ...query, search: searchTerm });
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = new this.productModel(productData);
    return product.save();
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, productData, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Product not found');
    }
  }

  async triggerScrape(productId?: string): Promise<{ message: string; jobId?: string }> {
    const result = await this.scrapingService.scrapeProducts(productId);
    return {
      message: `Products scraping completed. Found ${result.count} products.`,
      jobId: `prod-${Date.now()}`
    };
  }

  async getRelatedProducts(productId: string, limit = 6): Promise<Product[]> {
    const product = await this.findOne(productId);

    // Find products in the same category or with similar tags
    const filter: any = {
      _id: { $ne: productId },
      isAvailable: true,
    };

    if (product.categoryId) {
      filter.categoryId = product.categoryId;
    }

    return this.productModel
      .find(filter)
      .limit(limit)
      .sort({ rating: -1, createdAt: -1 })
      .exec();
  }

  async getReviews(productId: string): Promise<Review[]> {
    // Verify product exists
    await this.findOne(productId);

    return this.reviewModel
      .find({ productId })
      .sort({ reviewDate: -1, createdAt: -1 })
      .exec();
  }

  async createReview(productId: string, reviewData: Partial<Review>): Promise<Review> {
    // Verify product exists
    await this.findOne(productId);

    const review = new this.reviewModel({
      ...reviewData,
      productId,
      reviewDate: reviewData.reviewDate || new Date(),
      isVerified: reviewData.isVerified ?? true,
    });

    return review.save();
  }

  async createMockReviews(): Promise<void> {
    const products = await this.productModel.find().limit(5).exec();

    const mockReviews = [
      {
        reviewerName: 'Sarah Johnson',
        rating: 5,
        title: 'Excellent read!',
        content: 'This book completely captivated me from the first page. The writing is beautiful and the story is both compelling and thought-provoking. Highly recommend!',
      },
      {
        reviewerName: 'Michael Chen',
        rating: 4,
        title: 'Great story, engaging characters',
        content: 'The plot kept me engaged throughout. The characters are well-developed and the pacing is just right. A solid 4-star read.',
      },
      {
        reviewerName: 'Emily Davis',
        rating: 5,
        title: 'Couldn\'t put it down',
        content: 'Finished this in two days! The twists and turns kept me guessing until the end. Perfect for anyone who loves mystery and suspense.',
      },
      {
        reviewerName: 'Robert Wilson',
        rating: 3,
        title: 'Decent but not exceptional',
        content: 'The story was interesting but the ending felt a bit rushed. Still worth reading if you\'re into this genre.',
      },
      {
        reviewerName: 'Lisa Thompson',
        rating: 5,
        title: 'Absolutely loved it!',
        content: 'One of the best books I\'ve read this year. The author\'s style is engaging and the themes are timeless. Will definitely read more from this author.',
      },
    ];

    for (const product of products) {
      // Add 1-3 random reviews per product
      const numReviews = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < numReviews; i++) {
        const randomReview = mockReviews[Math.floor(Math.random() * mockReviews.length)];
        await this.createReview(product._id.toString(), {
          ...randomReview,
          reviewDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        });
      }
    }
  }
}
