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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("../../schemas/category.schema");
const scraping_service_1 = require("../scraping/scraping.service");
let CategoriesService = class CategoriesService {
    categoryModel;
    scrapingService;
    constructor(categoryModel, scrapingService) {
        this.categoryModel = categoryModel;
        this.scrapingService = scrapingService;
    }
    async findAll(parentCategoryId) {
        const query = { isActive: true };
        if (parentCategoryId) {
            query['parentCategoryId'] = parentCategoryId;
        }
        else {
            query['parentCategoryId'] = { $exists: false };
        }
        return this.categoryModel.find(query).sort({ name: 1 }).exec();
    }
    async findOne(id) {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async findByNavigationHeading(navigationHeadingId) {
        return this.categoryModel
            .find({ navigationHeadingId, isActive: true })
            .sort({ name: 1 })
            .exec();
    }
    async create(categoryData) {
        const category = new this.categoryModel(categoryData);
        return category.save();
    }
    async update(id, categoryData) {
        const category = await this.categoryModel
            .findByIdAndUpdate(id, categoryData, { new: true })
            .exec();
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async remove(id) {
        const result = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Category not found');
        }
    }
    async getCategoryTree(navigationHeadingId) {
        const query = { isActive: true };
        if (navigationHeadingId) {
            query['navigationHeadingId'] = navigationHeadingId;
        }
        return this.categoryModel.find(query).sort({ name: 1 }).exec();
    }
    async triggerScrape(categoryId) {
        const result = await this.scrapingService.scrapeCategories(categoryId);
        return {
            message: `Categories scraping completed. Found ${result.count} categories.`,
            jobId: `cat-${Date.now()}`
        };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => scraping_service_1.ScrapingService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        scraping_service_1.ScrapingService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map