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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../../schemas/product.schema");
const review_schema_1 = require("../../schemas/review.schema");
const scraping_service_1 = require("../scraping/scraping.service");
let ProductsService = class ProductsService {
    productModel;
    reviewModel;
    scrapingService;
    constructor(productModel, reviewModel, scrapingService) {
        this.productModel = productModel;
        this.reviewModel = reviewModel;
        this.scrapingService = scrapingService;
    }
    async findAll(query = {}) {
        const { categoryId, search, minPrice, maxPrice, isAvailable = true, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 20, } = query;
        const filter = { isAvailable };
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
            if (minPrice !== undefined)
                filter.price.$gte = minPrice;
            if (maxPrice !== undefined)
                filter.price.$lte = maxPrice;
        }
        const sortOptions = {};
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
    async findOne(id) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async findByCategory(categoryId, query = {}) {
        return this.findAll({ ...query, categoryId });
    }
    async search(searchTerm, query = {}) {
        return this.findAll({ ...query, search: searchTerm });
    }
    async create(productData) {
        const product = new this.productModel(productData);
        return product.save();
    }
    async update(id, productData) {
        const product = await this.productModel
            .findByIdAndUpdate(id, productData, { new: true })
            .exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async remove(id) {
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Product not found');
        }
    }
    async triggerScrape(productId) {
        const result = await this.scrapingService.scrapeProducts(productId);
        return {
            message: `Products scraping completed. Found ${result.count} products.`,
            jobId: `prod-${Date.now()}`
        };
    }
    async getRelatedProducts(productId, limit = 6) {
        const product = await this.findOne(productId);
        const filter = {
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
    async getReviews(productId) {
        await this.findOne(productId);
        return this.reviewModel
            .find({ productId })
            .sort({ reviewDate: -1, createdAt: -1 })
            .exec();
    }
    async createReview(productId, reviewData) {
        await this.findOne(productId);
        const review = new this.reviewModel({
            ...reviewData,
            productId,
            reviewDate: reviewData.reviewDate || new Date(),
            isVerified: reviewData.isVerified ?? true,
        });
        return review.save();
    }
    async createMockReviews() {
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
            const numReviews = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numReviews; i++) {
                const randomReview = mockReviews[Math.floor(Math.random() * mockReviews.length)];
                await this.createReview(product._id.toString(), {
                    ...randomReview,
                    reviewDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                });
            }
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => scraping_service_1.ScrapingService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        scraping_service_1.ScrapingService])
], ProductsService);
//# sourceMappingURL=products.service.js.map