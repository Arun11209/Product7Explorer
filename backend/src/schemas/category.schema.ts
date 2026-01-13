import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: Types.ObjectId, ref: 'NavigationHeading' })
  navigationHeadingId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  parentCategoryId?: Types.ObjectId;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  productCount: number;

  @Prop({ type: Date })
  lastScrapedAt?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
