import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  image: string;

  @Prop()
  link: string;

  @Prop()
  description?: string;

  @Prop()
  stock?: number;

  @Prop()
  category?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product); 