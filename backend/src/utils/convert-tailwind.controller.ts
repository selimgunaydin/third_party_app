import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ConvertTailwindService } from './convert-tailwind.service';

@Controller('api/convert-tailwind')
export class ConvertTailwindController {
  constructor(
    private readonly convertTailwindService: ConvertTailwindService,
  ) {}

  @Post()
  async convertHtmlToCSS(@Body('html') html: string) {
    if (!html) {
      throw new BadRequestException('HTML içeriği gereklidir');
    }

    try {
      const css = await this.convertTailwindService.generateTailwindCSS(html);
      return { css };
    } catch (error) {
      throw new BadRequestException('CSS dönüştürme işlemi başarısız oldu');
    }
  }
} 