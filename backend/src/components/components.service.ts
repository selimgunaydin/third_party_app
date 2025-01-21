import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Component } from '../schemas/component.schema';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectModel(Component.name) private componentModel: Model<Component>,
  ) {}

  async create(createComponentDto: any, userId: string) {
    const component = await this.componentModel.create({
      ...createComponentDto,
      userId,
    });
    return component;
  }

  async findAll(userId: string) {
    return this.componentModel.find({ userId });
  }

  async findOne(id: string, userId: string) {
    const component = await this.componentModel.findOne({ _id: id, userId });
    if (!component) {
      throw new NotFoundException('Component bulunamadı');
    }
    return component;
  }

  async update(id: string, updateComponentDto: any, userId: string) {
    const component = await this.componentModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateComponentDto },
      { new: true },
    );
    if (!component) {
      throw new NotFoundException('Component bulunamadı');
    }
    return component;
  }

  async remove(id: string, userId: string) {
    const component = await this.componentModel.findOneAndDelete({ _id: id, userId });
    if (!component) {
      throw new NotFoundException('Component bulunamadı');
    }
    return component;
  }

  async findByApiKey(apiKey: string) {
    const components = await this.componentModel
      .find({ 'user.apiKeys': apiKey, isActive: true })
      .populate('userId', 'apiKeys');
    return components;
  }
} 