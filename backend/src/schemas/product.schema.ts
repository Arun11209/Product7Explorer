import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop()
  author?: string;

  @Prop()
  price?: string;

  @Prop()
  originalPrice?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ required: true })
  productUrl: string;

  @Prop({ required: true, unique: true })
  sourceId: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId?: Types.ObjectId;

  @Prop()
  description?: string;

  @Prop()
  publisher?: string;

  @Prop()
  publicationDate?: string;

  @Prop()
  isbn?: string;

  @Prop({ type: Number, default: 0 })
  rating?: number;

  @Prop({ type: Number, default: 0 })
  reviewCount?: number;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: false })
  isScraped: boolean;

  @Prop({ type: Date })
  lastScrapedAt?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
