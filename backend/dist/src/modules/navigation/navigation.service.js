"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const navigation_heading_schema_1 = require("../../schemas/navigation-heading.schema");
const scraping_service_1 = require("../scraping/scraping.service");
let NavigationService = class NavigationService {
    navigationModel;
    scrapingService;
    constructor(navigationModel, scrapingService) {
        this.navigationModel = navigationModel;
        this.scrapingService = scrapingService;
    }
    async findAll() {
        return this.navigationModel.find({ isActive: true }).sort({ name: 1 }).exec();
    }
    async findOne(id) {
        const navigation = await this.navigationModel.findById(id).exec();
        if (!navigation) {
            throw new common_1.NotFoundException('Navigation heading not found');
        }
        return navigation;
    }
    async create(navigationData) {
        const navigation = new this.navigationModel(navigationData);
        return navigation.save();
    }
    async update(id, navigationData) {
        const navigation = await this.navigationModel
            .findByIdAndUpdate(id, navigationData, { new: true })
            .exec();
        if (!navigation) {
            throw new common_1.NotFoundException('Navigation heading not found');
        }
        return navigation;
    }
    async remove(id) {
        const result = await this.navigationModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Navigation heading not found');
        }
    }
    async triggerScrape() {
        const result = await this.scrapingService.scrapeNavigationHeadings();
        return {
            message: `Navigation scraping completed. Found ${result.count} headings.`,
            jobId: `nav-${Date.now()}`
        };
    }
};
exports.NavigationService = NavigationService;
exports.NavigationService = NavigationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(navigation_heading_schema_1.NavigationHeading.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => scraping_service_1.ScrapingService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        scraping_service_1.ScrapingService])
], NavigationService);
//# sourceMappingURL=navigation.service.js.map