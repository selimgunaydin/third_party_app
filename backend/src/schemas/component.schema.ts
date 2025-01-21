import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ComponentDocument = Component & Document;

@Schema({ timestamps: true })
export class Component {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  selector: string;

  @Prop({ required: true })
  html: string;

  @Prop()
  css: string;

  @Prop()
  javascript: string;

  @Prop({ default: 'after' })
  position: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ComponentSchema = SchemaFactory.createForClass(Component); 