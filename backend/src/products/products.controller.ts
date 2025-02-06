import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ImportProductsDto } from './dto/import-products.dto';
import { Product } from '../schemas/product.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Request() req, @Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(req.user.id, createProductDto);
  }

  @Get()
  async findAll(@Request() req): Promise<Product[]> {
    return this.productsService.findAllByUserId(req.user.id);
  }

  @Post('import')
  async importFromXml(@Request() req, @Body() importProductsDto: ImportProductsDto): Promise<Product[]> {
    return this.productsService.importFromXml(req.user.id, importProductsDto);
  }
} 