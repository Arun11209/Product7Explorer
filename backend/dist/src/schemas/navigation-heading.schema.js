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
exports.NavigationHeadingSchema = exports.NavigationHeading = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let NavigationHeading = class NavigationHeading {
    name;
    url;
    description;
    isActive;
    lastScrapedAt;
    metadata;
};
exports.NavigationHeading = NavigationHeading;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], NavigationHeading.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NavigationHeading.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NavigationHeading.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], NavigationHeading.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], NavigationHeading.prototype, "lastScrapedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], NavigationHeading.prototype, "metadata", void 0);
exports.NavigationHeading = NavigationHeading = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], NavigationHeading);
exports.NavigationHeadingSchema = mongoose_1.SchemaFactory.createForClass(NavigationHeading);
//# sourceMappingURL=navigation-heading.schema.js.map