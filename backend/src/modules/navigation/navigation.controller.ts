import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { NavigationHeading } from '../../schemas/navigation-heading.schema';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  async findAll(): Promise<NavigationHeading[]> {
    return this.navigationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NavigationHeading> {
    return this.navigationService.findOne(id);
  }

  @Post()
  async create(@Body() navigationData: Partial<NavigationHeading>): Promise<NavigationHeading> {
    return this.navigationService.create(navigationData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() navigationData: Partial<NavigationHeading>,
  ): Promise<NavigationHeading> {
    return this.navigationService.update(id, navigationData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.navigationService.remove(id);
  }

  @Post('scrape')
  async triggerScrape(): Promise<{ message: string; jobId?: string }> {
    return this.navigationService.triggerScrape();
  }
}
