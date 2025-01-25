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

    // Search for active API key
    const user = await this.userModel.findOne({
      apiKeys: {
        $elemMatch: {
          key: apiKey,
          isActive: true
        }
      }
    });
    
    if (!user) {
      throw new UnauthorizedException('Invalid or inactive API key');
    }

    // Get user's active components
    const components = await this.componentModel.find({
      userId: user._id,
      isActive: true
    })
      .select('name selector html css javascript position')
      .lean();

    return components;
  }
} 