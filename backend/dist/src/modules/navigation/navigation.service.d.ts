import { Model } from 'mongoose';
import { NavigationHeading, NavigationHeadingDocument } from '../../schemas/navigation-heading.schema';
import { ScrapingService } from '../scraping/scraping.service';
export declare class NavigationService {
    private navigationModel;
    private scrapingService;
    constructor(navigationModel: Model<NavigationHeadingDocument>, scrapingService: ScrapingService);
    findAll(): Promise<NavigationHeading[]>;
    findOne(id: string): Promise<NavigationHeading>;
    create(navigationData: Partial<NavigationHeading>): Promise<NavigationHeading>;
    update(id: string, navigationData: Partial<NavigationHeading>): Promise<NavigationHeading>;
    remove(id: string): Promise<void>;
    triggerScrape(): Promise<{
        message: string;
        jobId?: string;
    }>;
}
