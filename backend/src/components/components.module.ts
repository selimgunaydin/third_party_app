import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Component, ComponentSchema } from '../schemas/component.schema';
import { ComponentsController } from './components.controller';
import { ComponentsService } from './components.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Component.name, schema: ComponentSchema },
    ]),
  ],
  controllers: [ComponentsController],
  providers: [ComponentsService],
})
export class ComponentsModule {} 