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
      // Validate API key and get components
      const components = await this.widgetService.getComponentsByApiKey(apiKey);
      
      // Add CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Content-Type', 'application/javascript');
      
      // Create widget script
      let script = `
(function() {
  // Store component data in global variable
  window.__thirdPartyComponents = ${JSON.stringify(components)};

  function initializeComponents() {
    const components = window.__thirdPartyComponents;
    if (!components || !Array.isArray(components)) return;

    // For each component
    components.forEach(component => {
      // Find target element for component
      const targetElements = document.querySelectorAll(component.selector);
      if (!targetElements.length) return;

      // Create component element
      const componentElement = document.createElement('div');
      componentElement.innerHTML = component.html;

      // Add component styles
      if (component.css) {
        const style = document.createElement('style');
        style.textContent = component.css;
        document.head.appendChild(style);
      }

      // Render component for each target element
      targetElements.forEach(targetElement => {
        const clonedElement = componentElement.cloneNode(true);

        // Add HTML content
        if (component.position === 'before') {
          targetElement.parentNode.insertBefore(clonedElement, targetElement);
        } else {
          // Add based on position
          targetElement.parentNode.insertBefore(clonedElement, targetElement.nextSibling);
        }

        // Execute JavaScript
        if (component.javascript) {
          const script = document.createElement('script');
          script.textContent = component.javascript;
          document.body.appendChild(script);
        }
      });
    });
  }

  // Show components when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComponents);
  } else {
    initializeComponents();
  }
})();`;
      
      // Send script
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