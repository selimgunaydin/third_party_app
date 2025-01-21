import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WidgetController } from './widget.controller';
import { WidgetService } from './widget.service';
import { User, UserSchema } from '../schemas/user.schema';
import { Component, ComponentSchema } from '../schemas/component.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Component.name, schema: ComponentSchema },
    ]),
  ],
  controllers: [WidgetController],
  providers: [WidgetService],
})
export class WidgetModule {} 