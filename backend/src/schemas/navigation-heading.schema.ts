import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NavigationHeadingDocument = NavigationHeading & Document;

@Schema({ timestamps: true })
export class NavigationHeading {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date })
  lastScrapedAt?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const NavigationHeadingSchema = SchemaFactory.createForClass(NavigationHeading);
