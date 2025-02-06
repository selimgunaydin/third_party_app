import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { ImportProductsDto } from './dto/import-products.dto';
import * as xml2js from 'xml2js';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(userId: string, createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel({
      ...createProductDto,
      userId: new Types.ObjectId(userId),
    });
    return product.save();
  }

  async findAllByUserId(userId: string): Promise<Product[]> {
    return this.productModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findBySKUAndUserId(sku: string, userId: string): Promise<Product | null> {
    return this.productModel.findOne({
      sku,
      userId: new Types.ObjectId(userId),
    }).exec();
  }

  async updateProduct(id: string, updateData: Partial<CreateProductDto>): Promise<Product | null> {
    return this.productModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).exec();
  }

  async importFromXml(userId: string, importProductsDto: ImportProductsDto): Promise<Product[]> {
    try {
      this.logger.debug('XML içeriği alındı, parsing başlıyor...');
      
      const parser = new xml2js.Parser({
        explicitArray: false,
        trim: true,
        explicitRoot: true,
        tagNameProcessors: [xml2js.processors.stripPrefix],
      });

      const result = await parser.parseStringPromise(importProductsDto.xmlContent);
      this.logger.debug('XML parsing tamamlandı:', JSON.stringify(result, null, 2));

      if (!result?.products?.product) {
        this.logger.error('Geçersiz XML formatı:', result);
        throw new BadRequestException('Invalid XML format: products or product node not found');
      }

      const productsArray = Array.isArray(result.products.product) 
        ? result.products.product 
        : [result.products.product];

      this.logger.debug(`${productsArray.length} adet ürün işlenecek`);

      const createdOrUpdatedProducts = await Promise.all(
        productsArray.map(async (product: any) => {
          try {
            if (!product.sku || !product.name || !product.price) {
              this.logger.warn('Eksik zorunlu alanlar:', product);
              return null;
            }

            const productData: CreateProductDto = {
              name: product.name?.toString(),
              sku: product.sku?.toString(),
              price: parseFloat(product.price?.toString() || '0'),
              description: product.description?.toString(),
              image: product.image?.toString(),
              link: product.link?.toString(),
              stock: product.stock ? parseInt(product.stock.toString(), 10) : undefined,
              category: product.category?.toString(),
            };

            // Veri doğrulama
            if (isNaN(productData.price) || productData.price <= 0) {
              this.logger.warn(`Geçersiz fiyat değeri: ${product.price} - SKU: ${productData.sku}`);
              return null;
            }

            if (productData.stock !== undefined && isNaN(productData.stock)) {
              this.logger.warn(`Geçersiz stok değeri: ${product.stock} - SKU: ${productData.sku}`);
              return null;
            }

            this.logger.debug(`Ürün işleniyor - SKU: ${productData.sku}`);
            const existingProduct = await this.findBySKUAndUserId(productData.sku, userId);

            if (existingProduct) {
              this.logger.debug(`Mevcut ürün güncelleniyor - SKU: ${productData.sku}`);
              return this.updateProduct(existingProduct._id.toString(), productData);
            } else {
              this.logger.debug(`Yeni ürün oluşturuluyor - SKU: ${productData.sku}`);
              return this.create(userId, productData);
            }
          } catch (error) {
            this.logger.error(`Ürün işlenirken hata oluştu - SKU: ${product.sku}`, error);
            return null;
          }
        })
      );

      const validProducts = createdOrUpdatedProducts.filter((product): product is Product => product !== null);
      this.logger.debug(`İşlem tamamlandı. Başarılı: ${validProducts.length}, Başarısız: ${productsArray.length - validProducts.length}`);

      return validProducts;
    } catch (error) {
      this.logger.error('XML import işlemi sırasında hata:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to parse XML file: ' + error.message);
    }
  }
} 