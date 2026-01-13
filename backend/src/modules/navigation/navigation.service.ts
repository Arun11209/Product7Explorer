import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NavigationHeading, NavigationHeadingDocument } from '../../schemas/navigation-heading.schema';
import { ScrapingService } from '../scraping/scraping.service';

@Injectable()
export class NavigationService {
  constructor(
    @InjectModel(NavigationHeading.name)
    private navigationModel: Model<NavigationHeadingDocument>,
    @Inject(forwardRef(() => ScrapingService))
    private scrapingService: ScrapingService,
  ) {}

  async findAll(): Promise<NavigationHeading[]> {
    return this.navigationModel.find({ isActive: true }).sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<NavigationHeading> {
    const navigation = await this.navigationModel.findById(id).exec();
    if (!navigation) {
      throw new NotFoundException('Navigation heading not found');
    }
    return navigation;
  }

  async create(navigationData: Partial<NavigationHeading>): Promise<NavigationHeading> {
    const navigation = new this.navigationModel(navigationData);
    return navigation.save();
  }

  async update(id: string, navigationData: Partial<NavigationHeading>): Promise<NavigationHeading> {
    const navigation = await this.navigationModel
      .findByIdAndUpdate(id, navigationData, { new: true })
      .exec();
    if (!navigation) {
      throw new NotFoundException('Navigation heading not found');
    }
    return navigation;
  }

  async remove(id: string): Promise<void> {
    const result = await this.navigationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Navigation heading not found');
    }
  }

  async triggerScrape(): Promise<{ message: string; jobId?: string }> {
    const result = await this.scrapingService.scrapeNavigationHeadings();
    return {
      message: `Navigation scraping completed. Found ${result.count} headings.`,
      jobId: `nav-${Date.now()}`
    };
  }
}
