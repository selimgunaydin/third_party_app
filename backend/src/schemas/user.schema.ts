import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export interface ApiKey {
  key: string;
  isActive: boolean;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  emailNotifications: boolean;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ key: String, isActive: Boolean }], default: [] })
  apiKeys: ApiKey[];

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop()
  avatar: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  company: string;

  @Prop()
  title: string;

  @Prop()
  bio: string;

  @Prop({ default: Date.now })
  lastLogin: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'suspended'] })
  status: string;

  @Prop({ type: Object, default: {
    language: 'tr',
    theme: 'light',
    notifications: true,
    emailNotifications: true
  }})
  preferences: UserPreferences;
}

export const UserSchema = SchemaFactory.createForClass(User); 