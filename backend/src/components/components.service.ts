import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Component } from '../schemas/component.schema';

interface CreateComponentDto {
  name: string;
  selector: string;
  position: 'before' | 'after';
  html: string;
  css?: string;
  javascript?: string;
  isActive: boolean;
}

type UpdateComponentDto = Partial<CreateComponentDto>;

@Injectable()
export class ComponentsService {
  constructor(
    @InjectModel(Component.name) private componentModel: Model<Component>,
  ) {}

  async create(createComponentDto: CreateComponentDto, userId: string) {
    const existingComponent = await this.componentModel.findOne({
      selector: createComponentDto.selector,
      userId
    });

    if (existingComponent) {
      throw new ConflictException({
        message: 'This selector is already in use',
        code: 'DUPLICATE_SELECTOR',
        field: 'selector'
      });
    }

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
      throw new NotFoundException('Component not found');
    }
    return component;
  }

  async update(id: string, updateComponentDto: UpdateComponentDto, userId: string) {
    if (updateComponentDto.selector) {
      const existingComponent = await this.componentModel.findOne({
        selector: updateComponentDto.selector,
        userId,
        _id: { $ne: id },
      });

      if (existingComponent) {
        throw new ConflictException({
          message: 'This selector is already in use',
          code: 'DUPLICATE_SELECTOR',
          field: 'selector',
        });
      }
    }

    const component = await this.componentModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateComponentDto },
      { new: true },
    );
    if (!component) {
      throw new NotFoundException('Component not found');
    }
    return component;
  }

  async remove(id: string, userId: string) {
    const component = await this.componentModel.findOneAndDelete({ _id: id, userId });
    if (!component) {
      throw new NotFoundException('Component not found');
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