import { Controller, Get, Query, Header, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { WidgetService } from './widget.service';

@Controller()
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get('widget.js')
  @Header('Content-Type', 'application/javascript')
  async serveWidget(
    @Query('apiKey') apiKey: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // API key'i doğrula ve component'leri al
      const components = await this.widgetService.getComponentsByApiKey(apiKey);
      
      // CORS header'larını ekle
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      
      // Widget script'ini oluştur
      const script = `
(function() {
  // Component verilerini global değişkene kaydet
  window.thirdPartyComponents = ${JSON.stringify(components)};

  // Component'leri render et
  function renderComponents() {
    const components = window.thirdPartyComponents;

    if (!Array.isArray(components) || components.length === 0) {
      console.warn('No components found');
      return;
    }

    // Her component için
    components.forEach(component => {
      // Component'in ekleneceği elementi bul
      const targetElements = document.querySelectorAll(component.selector);
      if (!targetElements || targetElements.length === 0) {
        console.warn(\`Target element not found for selector: \${component.selector}\`);
        return;
      }

      // Her hedef element için component'i render et
      targetElements.forEach(targetElement => {
        // Style ekle
        if (component.css) {
          const style = document.createElement('style');
          style.textContent = component.css;
          document.head.appendChild(style);
        }

        // HTML içeriğini ekle
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = component.html;
        
        // Position'a göre ekle
        if (component.position === 'before') {
          targetElement.insertBefore(tempContainer.firstElementChild, targetElement.firstChild);
        } else if (component.position === 'after') {
          targetElement.appendChild(tempContainer.firstElementChild);
        } else if (component.position === 'replace') {
          targetElement.innerHTML = component.html;
        }

        // JavaScript'i çalıştır
        if (component.javascript) {
          const script = document.createElement('script');
          script.textContent = component.javascript;
          document.body.appendChild(script);
        }
      });
    });
  }

  // Sayfa yüklendiğinde component'leri göster
  if (document.readyState === 'complete') {
    renderComponents();
  } else {
    window.addEventListener('load', renderComponents);
  }
})();`;
      
      // Script'i gönder
      res.send(script);
    } catch (error) {
      console.error('Widget serve error:', error);
      
      if (error instanceof HttpException) {
        res.status(error.getStatus()).send(`console.error("${error.message}")`);
      } else {
        res.status(HttpStatus.BAD_REQUEST).send(`console.error("Widget loading failed: ${error.message}")`);
      }
    }
  }
} 