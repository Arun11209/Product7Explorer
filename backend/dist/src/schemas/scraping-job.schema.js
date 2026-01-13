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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingJobSchema = exports.ScrapingJob = exports.ScrapingJobStatus = exports.ScrapingJobType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var ScrapingJobType;
(function (ScrapingJobType) {
    ScrapingJobType["NAVIGATION_HEADINGS"] = "navigation_headings";
    ScrapingJobType["CATEGORIES"] = "categories";
    ScrapingJobType["PRODUCTS"] = "products";
    ScrapingJobType["PRODUCT_DETAIL"] = "product_detail";
})(ScrapingJobType || (exports.ScrapingJobType = ScrapingJobType = {}));
var ScrapingJobStatus;
(function (ScrapingJobStatus) {
    ScrapingJobStatus["PENDING"] = "pending";
    ScrapingJobStatus["RUNNING"] = "running";
    ScrapingJobStatus["COMPLETED"] = "completed";
    ScrapingJobStatus["FAILED"] = "failed";
    ScrapingJobStatus["CANCELLED"] = "cancelled";
})(ScrapingJobStatus || (exports.ScrapingJobStatus = ScrapingJobStatus = {}));
let ScrapingJob = class ScrapingJob {
    type;
    status;
    targetUrl;
    parameters;
    priority;
    startedAt;
    completedAt;
    error;
    retryCount;
    maxRetries;
    result;
    metadata;
};
exports.ScrapingJob = ScrapingJob;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ScrapingJobType }),
    __metadata("design:type", String)
], ScrapingJob.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ScrapingJobStatus, default: ScrapingJobStatus.PENDING }),
    __metadata("design:type", String)
], ScrapingJob.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScrapingJob.prototype, "targetUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ScrapingJob.prototype, "parameters", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], ScrapingJob.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ScrapingJob.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], ScrapingJob.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ScrapingJob.prototype, "error", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], ScrapingJob.prototype, "retryCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 3 }),
    __metadata("design:type", Number)
], ScrapingJob.prototype, "maxRetries", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ScrapingJob.prototype, "result", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ScrapingJob.prototype, "metadata", void 0);
exports.ScrapingJob = ScrapingJob = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ScrapingJob);
exports.ScrapingJobSchema = mongoose_1.SchemaFactory.createForClass(ScrapingJob);
//# sourceMappingURL=scraping-job.schema.js.map