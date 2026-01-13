import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop()
  reviewerName?: string;

  @Prop({ type: Number, min: 1, max: 5 })
  rating?: number;

  @Prop()
  title?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Date })
  reviewDate?: Date;

  @Prop({ default: true })
  isVerified: boolean;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
