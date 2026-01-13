import { NavigationService } from './navigation.service';
import { NavigationHeading } from '../../schemas/navigation-heading.schema';
export declare class NavigationController {
    private readonly navigationService;
    constructor(navigationService: NavigationService);
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
