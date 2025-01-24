import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { WidgetService } from './widget.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get('/api/scripts/widget/script/widget.js')
  async getScript(@Query('apiKey') apiKey: string, @Res() res: Response) {
    try {
      const components = await this.widgetService.getComponentsByApiKey(apiKey);
      const scriptPath = path.join(process.cwd(), 'src', 'widget', 'script', 'widget.js');
      
      if (!fs.existsSync(scriptPath)) {
        throw new HttpException('Widget script not found', HttpStatus.NOT_FOUND);
      }

      let script = fs.readFileSync(scriptPath, 'utf8');

      // Components verisini script içine yerleştir
      script = script.replace('__COMPONENTS_DATA__', JSON.stringify(components));

      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      return res.send(script);
    } catch (error) {
      console.error('Script serve error:', error);
      
      if (error instanceof HttpException) {
        res.status(error.getStatus()).send(`console.error("${error.message}")`);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(`console.error("Script loading failed: ${error.message}")`);
      }
    }
  }
} 