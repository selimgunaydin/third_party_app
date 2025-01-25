import { Injectable } from '@nestjs/common';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ConvertTailwindService {
  private async processTailwind(html: string | any): Promise<string> {
    try {
      // HTML string kontrolü
      if (!html || typeof html !== 'string') {
        console.error('Geçersiz HTML formatı:', html);
        return '';
      }

      // HTML içeriğinden sınıfları çıkar
      const classMatch = html.match(/class="([^"]+)"/g);
      if (!classMatch) return '';

      const uniqueClasses = Array.from(
        new Set(
          classMatch
            .map((match) => {
              const matchResult = match.match(/class="([^"]+)"/);
              return matchResult ? matchResult[1].split(/\s+/) : [];
            })
            .flat()
            .filter(Boolean) // Boş sınıfları filtrele
        ),
      );

      if (uniqueClasses.length === 0) {
        return '';
      }

      // Geçici HTML dosyası oluştur
      const tempHtmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              @tailwind base;
              @tailwind components;
              @tailwind utilities;
            </style>
          </head>
          <body>
            ${uniqueClasses.map((className) => `<div class="${className}"></div>`).join('\n')}
          </body>
        </html>
      `;

      const tempHtmlPath = join(process.cwd(), 'temp.html');
      writeFileSync(tempHtmlPath, tempHtmlContent);

      // Tailwind yapılandırmasını güncelle
      const tailwindConfig = {
        content: [tempHtmlPath],
        theme: {
          extend: {},
        },
        corePlugins: {
          preflight: false,
        },
      };

      // PostCSS ile işle
      const result = await postcss([
        tailwind(tailwindConfig),
        autoprefixer,
      ]).process(
        '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
        {
          from: undefined,
        },
      );

      // Geçici dosyayı sil
      try {
        unlinkSync(tempHtmlPath);
      } catch (error) {
        console.error('Geçici dosya silinirken hata:', error);
      }

      // Sadece kullanılan sınıfları içeren CSS'i döndür
      const css = result.css;
      const usedStyles = uniqueClasses
        .map((className) => {
          const regex = new RegExp(
            `\\.${className.replace(/[[\]]/g, '\\$&')}\\s*{[^}]*}`,
            'g',
          );
          const matches = css.match(regex);
          return matches ? matches.join('\n') : '';
        })
        .filter(Boolean)
        .join('\n\n');

      return usedStyles;
    } catch (error) {
      console.error('CSS oluşturma hatası:', error);
      return '';
    }
  }

  public async generateTailwindCSS(html: string | any): Promise<string> {
    // HTML'i string'e dönüştür
    const htmlString = typeof html === 'string' ? html : String(html || '');
    return this.processTailwind(htmlString);
  }
} 