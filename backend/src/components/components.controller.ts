import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ComponentsService } from './components.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createComponentDto: any, @Request() req) {
    return this.componentsService.create(createComponentDto, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.componentsService.findAll(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.componentsService.findOne(id, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComponentDto: any,
    @Request() req,
  ) {
    return this.componentsService.update(id, updateComponentDto, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.componentsService.remove(id, req.user._id);
  }

  @Get('widget/components')
  findByApiKey(@Query('apiKey') apiKey: string) {
    return this.componentsService.findByApiKey(apiKey);
  }
} 