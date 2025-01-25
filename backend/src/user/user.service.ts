import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user;
  }

  async findByApiKey(apiKey: string) {
    const user = await this.userModel.findOne({
      apiKeys: {
        $elemMatch: {
          key: apiKey,
          isActive: true
        }
      }
    }).lean();
    
    if (!user) {
      throw new NotFoundException('API Key için kullanıcı bulunamadı');
    }

    return {
      ...user,
      _id: user._id.toString()
    };
  }

  async update(id: string, updateData: Partial<User>) {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password');
    
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user;
  }

  async updatePreferences(id: string, preferences: Partial<User['preferences']>) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    user.preferences = {
      ...user.preferences,
      ...preferences,
    };

    await user.save();
    return user.preferences;
  }

  async updateStatus(id: string, status: string) {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { status },
        { new: true }
      )
      .select('-password');
    
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user;
  }

  async updateLastLogin(id: string) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { lastLogin: new Date() },
        { new: true }
      )
      .select('-password');
  }
} 