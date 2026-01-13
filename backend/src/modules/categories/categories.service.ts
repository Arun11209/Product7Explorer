import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../../schemas/category.schema';
import { ScrapingService } from '../scraping/scraping.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    @Inject(forwardRef(() => ScrapingService))
    private scrapingService: ScrapingService,
  ) {}

  async findAll(parentCategoryId?: string): Promise<Category[]> {
    const query = { isActive: true };
    if (parentCategoryId) {
      query['parentCategoryId'] = parentCategoryId;
    } else {
      query['parentCategoryId'] = { $exists: false };
    }
    return this.categoryModel.find(query).sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findByNavigationHeading(navigationHeadingId: string): Promise<Category[]> {
    return this.categoryModel
      .find({ navigationHeadingId, isActive: true })
      .sort({ name: 1 })
      .exec();
  }

  async create(categoryData: Partial<Category>): Promise<Category> {
    const category = new this.categoryModel(categoryData);
    return category.save();
  }

  async update(id: string, categoryData: Partial<Category>): Promise<Category> {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, categoryData, { new: true })
      .exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Category not found');
    }
  }

  async getCategoryTree(navigationHeadingId?: string): Promise<Category[]> {
    const query = { isActive: true };
    if (navigationHeadingId) {
      query['navigationHeadingId'] = navigationHeadingId;
    }

    return this.categoryModel.find(query).sort({ name: 1 }).exec();
  }

  async triggerScrape(categoryId?: string): Promise<{ message: string; jobId?: string }> {
    const result = await this.scrapingService.scrapeCategories(categoryId);
    return {
      message: `Categories scraping completed. Found ${result.count} categories.`,
      jobId: `cat-${Date.now()}`
    };
  }
}
