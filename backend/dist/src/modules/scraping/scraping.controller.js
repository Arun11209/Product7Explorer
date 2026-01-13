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
exports.ScrapingController = void 0;
const common_1 = require("@nestjs/common");
const scraping_service_1 = require("./scraping.service");
let ScrapingController = class ScrapingController {
    scrapingService;
    constructor(scrapingService) {
        this.scrapingService = scrapingService;
    }
    async scrapeNavigation() {
        return this.scrapingService.scrapeNavigationHeadings();
    }
    async scrapeCategories(navigationHeadingId) {
        return this.scrapingService.scrapeCategories(navigationHeadingId);
    }
    async scrapeProducts(categoryId, limit) {
        return this.scrapingService.scrapeProducts(categoryId, limit);
    }
    async scrapeProductDetails(productId) {
        return this.scrapingService.scrapeProductDetails(productId);
    }
};
exports.ScrapingController = ScrapingController;
__decorate([
    (0, common_1.Post)('navigation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScrapingController.prototype, "scrapeNavigation", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Query)('navigationHeadingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScrapingController.prototype, "scrapeCategories", null);
__decorate([
    (0, common_1.Post)('products'),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ScrapingController.prototype, "scrapeProducts", null);
__decorate([
    (0, common_1.Post)('products/:productId/details'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScrapingController.prototype, "scrapeProductDetails", null);
exports.ScrapingController = ScrapingController = __decorate([
    (0, common_1.Controller)('scraping'),
    __metadata("design:paramtypes", [scraping_service_1.ScrapingService])
], ScrapingController);
//# sourceMappingURL=scraping.controller.js.map