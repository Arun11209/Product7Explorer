import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScrapingJobDocument = ScrapingJob & Document;

export enum ScrapingJobType {
  NAVIGATION_HEADINGS = 'navigation_headings',
  CATEGORIES = 'categories',
  PRODUCTS = 'products',
  PRODUCT_DETAIL = 'product_detail',
}

export enum ScrapingJobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class ScrapingJob {
  @Prop({ required: true, enum: ScrapingJobType })
  type: ScrapingJobType;

  @Prop({ required: true, enum: ScrapingJobStatus, default: ScrapingJobStatus.PENDING })
  status: ScrapingJobStatus;

  @Prop()
  targetUrl?: string;

  @Prop({ type: Object })
  parameters?: Record<string, any>;

  @Prop({ type: Number, default: 0 })
  priority: number;

  @Prop({ type: Date })
  startedAt?: Date;

  @Prop({ type: Date })
  completedAt?: Date;

  @Prop()
  error?: string;

  @Prop({ type: Number, default: 0 })
  retryCount: number;

  @Prop({ type: Number, default: 3 })
  maxRetries: number;

  @Prop({ type: Object })
  result?: Record<string, any>;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ScrapingJobSchema = SchemaFactory.createForClass(ScrapingJob);
