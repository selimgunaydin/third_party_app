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

interface RequestWithUser extends Request {
  user: {
    _id: string;
    email: string;
  };
}

@Controller('api/components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createComponentDto: CreateComponentDto, @Request() req: RequestWithUser) {
    return this.componentsService.create(createComponentDto, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.componentsService.findAll(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.componentsService.findOne(id, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComponentDto: UpdateComponentDto,
    @Request() req: RequestWithUser,
  ) {
    return this.componentsService.update(id, updateComponentDto, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.componentsService.remove(id, req.user._id);
  }

  @Get('widget/components')
  findByApiKey(@Query('apiKey') apiKey: string) {
    return this.componentsService.findByApiKey(apiKey);
  }
} 