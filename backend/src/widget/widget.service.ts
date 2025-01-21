import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Component } from '../schemas/component.schema';

@Injectable()
export class WidgetService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Component.name) private componentModel: Model<Component>,
  ) {}

  async getComponentsByApiKey(apiKey: string) {
    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // API key'i apiKeys array'inde ara
    const user = await this.userModel.findOne({ apiKeys: apiKey });
    if (!user) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Kullanıcının aktif component'lerini getir
    const components = await this.componentModel.find({
      userId: user._id,
      isActive: true
    })
      .select('name selector html css javascript position')
      .lean();

    return components;
  }
} 