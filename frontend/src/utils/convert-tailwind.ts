export const generateTailwindCSS = (html: string): string => {
  try {
    const classMatch = html.match(/class="([^"]+)"/g);
    if (!classMatch) return '';

    const uniqueClasses = Array.from(new Set(
      classMatch.map(match => match.match(/class="([^"]+)"/)![1].split(/\s+/)).flat()
    ));

    const cssRules = uniqueClasses.map(className => {
      const cssProperties = convertTailwindToCSS(className);
      if (cssProperties) {
        return `.${className} {\n  ${cssProperties}\n}`;
      }
      return '';
    }).filter(Boolean);

    return cssRules.join('\n\n');
  } catch (error) {
    console.error('CSS oluşturma hatası:', error);
    return '';
  }
};

export const convertTailwindToCSS = (className: string): string | null => {
  const getSpacing = (size: string): string => {
    const spacingMap: Record<string, string> = {
      'px': '1px',
      '0': '0',
      '0.5': '0.125rem',
      '1': '0.25rem',
      '1.5': '0.375rem',
      '2': '0.5rem',
      '2.5': '0.625rem',
      '3': '0.75rem',
      '3.5': '0.875rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
      '11': '2.75rem',
      '12': '3rem',
      '14': '3.5rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '28': '7rem',
      '32': '8rem',
      '36': '9rem',
      '40': '10rem',
      '44': '11rem',
      '48': '12rem',
      '52': '13rem',
      '56': '14rem',
      '60': '15rem',
      '64': '16rem',
      '72': '18rem',
      '80': '20rem',
      '96': '24rem',
    };
    return spacingMap[size] || size;
  };

  const getColor = (color: string, shade: string = 'DEFAULT'): string => {
    const colorMap: Record<string, Record<string, string>> = {
      'transparent': { DEFAULT: 'transparent' },
      'current': { DEFAULT: 'currentColor' },
      'black': { DEFAULT: '#000000' },
      'white': { DEFAULT: '#ffffff' },
      'gray': {
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827',
      },
      'red': {
        '50': '#fef2f2',
        '100': '#fee2e2',
        '200': '#fecaca',
        '300': '#fca5a5',
        '400': '#f87171',
        '500': '#ef4444',
        '600': '#dc2626',
        '700': '#b91c1c',
        '800': '#991b1b',
        '900': '#7f1d1d',
      },
      'blue': {
        '50': '#eff6ff',
        '100': '#dbeafe',
        '200': '#bfdbfe',
        '300': '#93c5fd',
        '400': '#60a5fa',
        '500': '#3b82f6',
        '600': '#2563eb',
        '700': '#1d4ed8',
        '800': '#1e40af',
        '900': '#1e3a8a',
      },
    };
    return colorMap[color]?.[shade] || color;
  };

  if (className.startsWith('bg-')) {
    const [, color, shade] = className.split('-');
    return `background-color: ${getColor(color, shade)};`;
  }

  if (className.startsWith('text-')) {
    const [, color, shade] = className.split('-');
    return `color: ${getColor(color, shade)};`;
  }

  if (className.startsWith('p-')) {
    const size = className.replace('p-', '');
    return `padding: ${getSpacing(size)};`;
  }

  if (className.startsWith('px-')) {
    const size = className.replace('px-', '');
    return `padding-left: ${getSpacing(size)}; padding-right: ${getSpacing(size)};`;
  }

  if (className.startsWith('py-')) {
    const size = className.replace('py-', '');
    return `padding-top: ${getSpacing(size)}; padding-bottom: ${getSpacing(size)};`;
  }

  if (className.startsWith('pt-')) {
    const size = className.replace('pt-', '');
    return `padding-top: ${getSpacing(size)};`;
  }

  if (className.startsWith('pr-')) {
    const size = className.replace('pr-', '');
    return `padding-right: ${getSpacing(size)};`;
  }

  if (className.startsWith('pb-')) {
    const size = className.replace('pb-', '');
    return `padding-bottom: ${getSpacing(size)};`;
  }

  if (className.startsWith('pl-')) {
    const size = className.replace('pl-', '');
    return `padding-left: ${getSpacing(size)};`;
  }

  if (className.startsWith('m-')) {
    const size = className.replace('m-', '');
    return `margin: ${getSpacing(size)};`;
  }

  if (className.startsWith('mx-')) {
    const size = className.replace('mx-', '');
    return `margin-left: ${getSpacing(size)}; margin-right: ${getSpacing(size)};`;
  }

  if (className.startsWith('my-')) {
    const size = className.replace('my-', '');
    return `margin-top: ${getSpacing(size)}; margin-bottom: ${getSpacing(size)};`;
  }

  if (className.startsWith('mt-')) {
    const size = className.replace('mt-', '');
    return `margin-top: ${getSpacing(size)};`;
  }

  if (className.startsWith('mr-')) {
    const size = className.replace('mr-', '');
    return `margin-right: ${getSpacing(size)};`;
  }

  if (className.startsWith('mb-')) {
    const size = className.replace('mb-', '');
    return `margin-bottom: ${getSpacing(size)};`;
  }

  if (className.startsWith('ml-')) {
    const size = className.replace('ml-', '');
    return `margin-left: ${getSpacing(size)};`;
  }

  // Width ve Height
  if (className.startsWith('w-')) {
    const size = className.replace('w-', '');
    if (size === 'full') return 'width: 100%;';
    if (size === 'screen') return 'width: 100vw;';
    return `width: ${getSpacing(size)};`;
  }

  if (className.startsWith('h-')) {
    const size = className.replace('h-', '');
    if (size === 'full') return 'height: 100%;';
    if (size === 'screen') return 'height: 100vh;';
    return `height: ${getSpacing(size)};`;
  }

  if (className === 'rounded') return 'border-radius: 0.25rem;';
  if (className === 'rounded-sm') return 'border-radius: 0.125rem;';
  if (className === 'rounded-md') return 'border-radius: 0.375rem;';
  if (className === 'rounded-lg') return 'border-radius: 0.5rem;';
  if (className === 'rounded-xl') return 'border-radius: 0.75rem;';
  if (className === 'rounded-2xl') return 'border-radius: 1rem;';
  if (className === 'rounded-3xl') return 'border-radius: 1.5rem;';
  if (className === 'rounded-full') return 'border-radius: 9999px;';

  if (className === 'flex') return 'display: flex;';
  if (className === 'grid') return 'display: grid;';
  if (className === 'block') return 'display: block;';
  if (className === 'inline') return 'display: inline;';
  if (className === 'inline-block') return 'display: inline-block;';
  if (className === 'hidden') return 'display: none;';

  if (className === 'items-center') return 'align-items: center;';
  if (className === 'items-start') return 'align-items: flex-start;';
  if (className === 'items-end') return 'align-items: flex-end;';
  if (className === 'justify-center') return 'justify-content: center;';
  if (className === 'justify-start') return 'justify-content: flex-start;';
  if (className === 'justify-end') return 'justify-content: flex-end;';
  if (className === 'justify-between') return 'justify-content: space-between;';
  if (className === 'justify-around') return 'justify-content: space-around;';

  if (className.startsWith('gap-')) {
    const size = className.replace('gap-', '');
    return `gap: ${getSpacing(size)};`;
  }

  if (className.startsWith('text-')) {
    const sizeMap: Record<string, string> = {
      'xs': 'font-size: 0.75rem; line-height: 1rem;',
      'sm': 'font-size: 0.875rem; line-height: 1.25rem;',
      'base': 'font-size: 1rem; line-height: 1.5rem;',
      'lg': 'font-size: 1.125rem; line-height: 1.75rem;',
      'xl': 'font-size: 1.25rem; line-height: 1.75rem;',
      '2xl': 'font-size: 1.5rem; line-height: 2rem;',
      '3xl': 'font-size: 1.875rem; line-height: 2.25rem;',
      '4xl': 'font-size: 2.25rem; line-height: 2.5rem;',
      '5xl': 'font-size: 3rem; line-height: 1;',
      '6xl': 'font-size: 3.75rem; line-height: 1;',
    };
    const size = className.replace('text-', '');
    return sizeMap[size];
  }

  if (className.startsWith('font-')) {
    const weightMap: Record<string, string> = {
      'thin': 'font-weight: 100;',
      'extralight': 'font-weight: 200;',
      'light': 'font-weight: 300;',
      'normal': 'font-weight: 400;',
      'medium': 'font-weight: 500;',
      'semibold': 'font-weight: 600;',
      'bold': 'font-weight: 700;',
      'extrabold': 'font-weight: 800;',
      'black': 'font-weight: 900;',
    };
    const weight = className.replace('font-', '');
    return weightMap[weight];
  }

  if (className.startsWith('opacity-')) {
    const opacity = parseInt(className.replace('opacity-', '')) / 100;
    return `opacity: ${opacity};`;
  }

  if (className === 'transform') return 'transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));';
  
  if (className.startsWith('scale-')) {
    const scale = parseInt(className.replace('scale-', '')) / 100;
    return `transform: scale(${scale});`;
  }

  if (className.startsWith('rotate-')) {
    const degrees = className.replace('rotate-', '');
    return `transform: rotate(${degrees}deg);`;
  }

  const shadowMap: Record<string, string> = {
    'shadow-sm': 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);',
    'shadow': 'box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);',
    'shadow-md': 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);',
    'shadow-lg': 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);',
    'shadow-xl': 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);',
    'shadow-2xl': 'box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);',
    'shadow-inner': 'box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);',
    'shadow-none': 'box-shadow: 0 0 #0000;',
  };
  
  if (shadowMap[className]) {
    return shadowMap[className];
  }

  // Flexbox ve Grid özellikleri
  if (className === 'flex-row') return 'flex-direction: row;';
  if (className === 'flex-row-reverse') return 'flex-direction: row-reverse;';
  if (className === 'flex-col') return 'flex-direction: column;';
  if (className === 'flex-col-reverse') return 'flex-direction: column-reverse;';
  if (className === 'flex-wrap') return 'flex-wrap: wrap;';
  if (className === 'flex-nowrap') return 'flex-wrap: nowrap;';
  if (className === 'flex-wrap-reverse') return 'flex-wrap: wrap-reverse;';

  // Grid template columns
  if (className.startsWith('grid-cols-')) {
    const cols = className.replace('grid-cols-', '');
    if (cols === 'none') return 'grid-template-columns: none;';
    return `grid-template-columns: repeat(${cols}, minmax(0, 1fr));`;
  }

  // Grid template rows
  if (className.startsWith('grid-rows-')) {
    const rows = className.replace('grid-rows-', '');
    if (rows === 'none') return 'grid-template-rows: none;';
    return `grid-template-rows: repeat(${rows}, minmax(0, 1fr));`;
  }

  // Grid column span
  if (className.startsWith('col-span-')) {
    const span = className.replace('col-span-', '');
    if (span === 'full') return 'grid-column: 1 / -1;';
    return `grid-column: span ${span} / span ${span};`;
  }

  // Grid row span
  if (className.startsWith('row-span-')) {
    const span = className.replace('row-span-', '');
    if (span === 'full') return 'grid-row: 1 / -1;';
    return `grid-row: span ${span} / span ${span};`;
  }

  // Position
  if (className === 'static') return 'position: static;';
  if (className === 'fixed') return 'position: fixed;';
  if (className === 'absolute') return 'position: absolute;';
  if (className === 'relative') return 'position: relative;';
  if (className === 'sticky') return 'position: sticky;';

  // Top, Right, Bottom, Left
  if (className.startsWith('top-')) {
    const value = className.replace('top-', '');
    return `top: ${getSpacing(value)};`;
  }
  if (className.startsWith('right-')) {
    const value = className.replace('right-', '');
    return `right: ${getSpacing(value)};`;
  }
  if (className.startsWith('bottom-')) {
    const value = className.replace('bottom-', '');
    return `bottom: ${getSpacing(value)};`;
  }
  if (className.startsWith('left-')) {
    const value = className.replace('left-', '');
    return `left: ${getSpacing(value)};`;
  }

  // Z-index
  if (className.startsWith('z-')) {
    const value = className.replace('z-', '');
    return `z-index: ${value};`;
  }

  // Overflow
  if (className === 'overflow-auto') return 'overflow: auto;';
  if (className === 'overflow-hidden') return 'overflow: hidden;';
  if (className === 'overflow-visible') return 'overflow: visible;';
  if (className === 'overflow-scroll') return 'overflow: scroll;';
  if (className === 'overflow-x-auto') return 'overflow-x: auto;';
  if (className === 'overflow-y-auto') return 'overflow-y: auto;';
  if (className === 'overflow-x-hidden') return 'overflow-x: hidden;';
  if (className === 'overflow-y-hidden') return 'overflow-y: hidden;';

  // Cursor
  if (className === 'cursor-pointer') return 'cursor: pointer;';
  if (className === 'cursor-default') return 'cursor: default;';
  if (className === 'cursor-not-allowed') return 'cursor: not-allowed;';
  if (className === 'cursor-wait') return 'cursor: wait;';
  if (className === 'cursor-text') return 'cursor: text;';
  if (className === 'cursor-move') return 'cursor: move;';
  if (className === 'cursor-help') return 'cursor: help;';
  if (className === 'cursor-grab') return 'cursor: grab;';
  if (className === 'cursor-grabbing') return 'cursor: grabbing;';

  // Border
  if (className === 'border') return 'border-width: 1px;';
  if (className === 'border-0') return 'border-width: 0px;';
  if (className === 'border-2') return 'border-width: 2px;';
  if (className === 'border-4') return 'border-width: 4px;';
  if (className === 'border-8') return 'border-width: 8px;';

  if (className.startsWith('border-t-')) {
    const size = className.replace('border-t-', '');
    return `border-top-width: ${size}px;`;
  }
  if (className.startsWith('border-r-')) {
    const size = className.replace('border-r-', '');
    return `border-right-width: ${size}px;`;
  }
  if (className.startsWith('border-b-')) {
    const size = className.replace('border-b-', '');
    return `border-bottom-width: ${size}px;`;
  }
  if (className.startsWith('border-l-')) {
    const size = className.replace('border-l-', '');
    return `border-left-width: ${size}px;`;
  }

  // Border Style
  if (className === 'border-solid') return 'border-style: solid;';
  if (className === 'border-dashed') return 'border-style: dashed;';
  if (className === 'border-dotted') return 'border-style: dotted;';
  if (className === 'border-double') return 'border-style: double;';
  if (className === 'border-none') return 'border-style: none;';

  // Transition
  if (className === 'transition') return 'transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;';
  if (className === 'transition-none') return 'transition-property: none;';
  if (className === 'transition-all') return 'transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;';
  if (className === 'transition-colors') return 'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;';
  if (className === 'transition-opacity') return 'transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;';
  if (className === 'transition-shadow') return 'transition-property: box-shadow; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;';
  if (className === 'transition-transform') return 'transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;';

  // Duration
  if (className.startsWith('duration-')) {
    const duration = className.replace('duration-', '');
    return `transition-duration: ${duration}ms;`;
  }

  // Ease
  const easeMap: Record<string, string> = {
    'ease-linear': 'transition-timing-function: linear;',
    'ease-in': 'transition-timing-function: cubic-bezier(0.4, 0, 1, 1);',
    'ease-out': 'transition-timing-function: cubic-bezier(0, 0, 0.2, 1);',
    'ease-in-out': 'transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);',
  };
  if (easeMap[className]) return easeMap[className];

  // Object Fit
  if (className === 'object-contain') return 'object-fit: contain;';
  if (className === 'object-cover') return 'object-fit: cover;';
  if (className === 'object-fill') return 'object-fit: fill;';
  if (className === 'object-none') return 'object-fit: none;';
  if (className === 'object-scale-down') return 'object-fit: scale-down;';

  // Object Position
  if (className === 'object-bottom') return 'object-position: bottom;';
  if (className === 'object-center') return 'object-position: center;';
  if (className === 'object-left') return 'object-position: left;';
  if (className === 'object-left-bottom') return 'object-position: left bottom;';
  if (className === 'object-left-top') return 'object-position: left top;';
  if (className === 'object-right') return 'object-position: right;';
  if (className === 'object-right-bottom') return 'object-position: right bottom;';
  if (className === 'object-right-top') return 'object-position: right top;';
  if (className === 'object-top') return 'object-position: top;';

  // Min/Max Width ve Height
  if (className.startsWith('min-w-')) {
    const size = className.replace('min-w-', '');
    if (size === 'full') return 'min-width: 100%;';
    if (size === 'min') return 'min-width: min-content;';
    if (size === 'max') return 'min-width: max-content;';
    if (size === 'fit') return 'min-width: fit-content;';
    return `min-width: ${getSpacing(size)};`;
  }

  if (className.startsWith('max-w-')) {
    const size = className.replace('max-w-', '');
    if (size === 'full') return 'max-width: 100%;';
    if (size === 'min') return 'max-width: min-content;';
    if (size === 'max') return 'max-width: max-content;';
    if (size === 'fit') return 'max-width: fit-content;';
    if (size === 'prose') return 'max-width: 65ch;';
    if (size === 'screen-sm') return 'max-width: 640px;';
    if (size === 'screen-md') return 'max-width: 768px;';
    if (size === 'screen-lg') return 'max-width: 1024px;';
    if (size === 'screen-xl') return 'max-width: 1280px;';
    if (size === 'screen-2xl') return 'max-width: 1536px;';
    return `max-width: ${getSpacing(size)};`;
  }

  if (className.startsWith('min-h-')) {
    const size = className.replace('min-h-', '');
    if (size === 'full') return 'min-height: 100%;';
    if (size === 'screen') return 'min-height: 100vh;';
    if (size === 'min') return 'min-height: min-content;';
    if (size === 'max') return 'min-height: max-content;';
    if (size === 'fit') return 'min-height: fit-content;';
    return `min-height: ${getSpacing(size)};`;
  }

  if (className.startsWith('max-h-')) {
    const size = className.replace('max-h-', '');
    if (size === 'full') return 'max-height: 100%;';
    if (size === 'screen') return 'max-height: 100vh;';
    if (size === 'min') return 'max-height: min-content;';
    if (size === 'max') return 'max-height: max-content;';
    if (size === 'fit') return 'max-height: fit-content;';
    return `max-height: ${getSpacing(size)};`;
  }

  // Typography
  if (className === 'text-left') return 'text-align: left;';
  if (className === 'text-center') return 'text-align: center;';
  if (className === 'text-right') return 'text-align: right;';
  if (className === 'text-justify') return 'text-align: justify;';

  if (className === 'underline') return 'text-decoration: underline;';
  if (className === 'line-through') return 'text-decoration: line-through;';
  if (className === 'no-underline') return 'text-decoration: none;';

  if (className === 'uppercase') return 'text-transform: uppercase;';
  if (className === 'lowercase') return 'text-transform: lowercase;';
  if (className === 'capitalize') return 'text-transform: capitalize;';
  if (className === 'normal-case') return 'text-transform: none;';

  if (className.startsWith('leading-')) {
    const lineHeight = className.replace('leading-', '');
    const lineHeightMap: Record<string, string> = {
      'none': '1',
      'tight': '1.25',
      'snug': '1.375',
      'normal': '1.5',
      'relaxed': '1.625',
      'loose': '2',
    };
    return `line-height: ${lineHeightMap[lineHeight] || lineHeight};`;
  }

  // Whitespace
  if (className === 'whitespace-normal') return 'white-space: normal;';
  if (className === 'whitespace-nowrap') return 'white-space: nowrap;';
  if (className === 'whitespace-pre') return 'white-space: pre;';
  if (className === 'whitespace-pre-line') return 'white-space: pre-line;';
  if (className === 'whitespace-pre-wrap') return 'white-space: pre-wrap;';

  // Word Break
  if (className === 'break-normal') return 'overflow-wrap: normal; word-break: normal;';
  if (className === 'break-words') return 'overflow-wrap: break-word;';
  if (className === 'break-all') return 'word-break: break-all;';

  // Background
  if (className === 'bg-fixed') return 'background-attachment: fixed;';
  if (className === 'bg-local') return 'background-attachment: local;';
  if (className === 'bg-scroll') return 'background-attachment: scroll;';

  if (className === 'bg-clip-border') return 'background-clip: border-box;';
  if (className === 'bg-clip-padding') return 'background-clip: padding-box;';
  if (className === 'bg-clip-content') return 'background-clip: content-box;';
  if (className === 'bg-clip-text') return 'background-clip: text;';

  if (className === 'bg-repeat') return 'background-repeat: repeat;';
  if (className === 'bg-no-repeat') return 'background-repeat: no-repeat;';
  if (className === 'bg-repeat-x') return 'background-repeat: repeat-x;';
  if (className === 'bg-repeat-y') return 'background-repeat: repeat-y;';
  if (className === 'bg-repeat-round') return 'background-repeat: round;';
  if (className === 'bg-repeat-space') return 'background-repeat: space;';

  // Filter ve Backdrop Filter
  if (className.startsWith('blur-')) {
    const value = className.replace('blur-', '');
    if (value === 'none') return 'filter: blur(0);';
    if (value === 'sm') return 'filter: blur(4px);';
    if (value === 'md') return 'filter: blur(8px);';
    if (value === 'lg') return 'filter: blur(12px);';
    if (value === 'xl') return 'filter: blur(16px);';
    if (value === '2xl') return 'filter: blur(24px);';
    if (value === '3xl') return 'filter: blur(36px);';
    return `filter: blur(${value}px);`;
  }

  if (className.startsWith('brightness-')) {
    const value = parseInt(className.replace('brightness-', '')) / 100;
    return `filter: brightness(${value});`;
  }

  if (className.startsWith('contrast-')) {
    const value = parseInt(className.replace('contrast-', '')) / 100;
    return `filter: contrast(${value});`;
  }

  if (className.startsWith('grayscale-')) {
    const value = parseInt(className.replace('grayscale-', '')) / 100;
    return `filter: grayscale(${value});`;
  }

  if (className.startsWith('hue-rotate-')) {
    const value = className.replace('hue-rotate-', '');
    return `filter: hue-rotate(${value}deg);`;
  }

  if (className.startsWith('invert-')) {
    const value = parseInt(className.replace('invert-', '')) / 100;
    return `filter: invert(${value});`;
  }

  if (className.startsWith('saturate-')) {
    const value = parseInt(className.replace('saturate-', '')) / 100;
    return `filter: saturate(${value});`;
  }

  if (className.startsWith('sepia-')) {
    const value = parseInt(className.replace('sepia-', '')) / 100;
    return `filter: sepia(${value});`;
  }

  // Transform Origin
  if (className === 'origin-center') return 'transform-origin: center;';
  if (className === 'origin-top') return 'transform-origin: top;';
  if (className === 'origin-top-right') return 'transform-origin: top right;';
  if (className === 'origin-right') return 'transform-origin: right;';
  if (className === 'origin-bottom-right') return 'transform-origin: bottom right;';
  if (className === 'origin-bottom') return 'transform-origin: bottom;';
  if (className === 'origin-bottom-left') return 'transform-origin: bottom left;';
  if (className === 'origin-left') return 'transform-origin: left;';
  if (className === 'origin-top-left') return 'transform-origin: top left;';

  // Backdrop Filter
  if (className.startsWith('backdrop-blur-')) {
    const value = className.replace('backdrop-blur-', '');
    if (value === 'none') return 'backdrop-filter: blur(0);';
    if (value === 'sm') return 'backdrop-filter: blur(4px);';
    if (value === 'md') return 'backdrop-filter: blur(8px);';
    if (value === 'lg') return 'backdrop-filter: blur(12px);';
    if (value === 'xl') return 'backdrop-filter: blur(16px);';
    if (value === '2xl') return 'backdrop-filter: blur(24px);';
    if (value === '3xl') return 'backdrop-filter: blur(36px);';
    return `backdrop-filter: blur(${value}px);`;
  }

  if (className.startsWith('backdrop-brightness-')) {
    const value = parseInt(className.replace('backdrop-brightness-', '')) / 100;
    return `backdrop-filter: brightness(${value});`;
  }

  if (className.startsWith('backdrop-contrast-')) {
    const value = parseInt(className.replace('backdrop-contrast-', '')) / 100;
    return `backdrop-filter: contrast(${value});`;
  }

  if (className.startsWith('backdrop-grayscale-')) {
    const value = parseInt(className.replace('backdrop-grayscale-', '')) / 100;
    return `backdrop-filter: grayscale(${value});`;
  }

  if (className.startsWith('backdrop-hue-rotate-')) {
    const value = className.replace('backdrop-hue-rotate-', '');
    return `backdrop-filter: hue-rotate(${value}deg);`;
  }

  if (className.startsWith('backdrop-invert-')) {
    const value = parseInt(className.replace('backdrop-invert-', '')) / 100;
    return `backdrop-filter: invert(${value});`;
  }

  if (className.startsWith('backdrop-opacity-')) {
    const value = parseInt(className.replace('backdrop-opacity-', '')) / 100;
    return `backdrop-filter: opacity(${value});`;
  }

  if (className.startsWith('backdrop-saturate-')) {
    const value = parseInt(className.replace('backdrop-saturate-', '')) / 100;
    return `backdrop-filter: saturate(${value});`;
  }

  if (className.startsWith('backdrop-sepia-')) {
    const value = parseInt(className.replace('backdrop-sepia-', '')) / 100;
    return `backdrop-filter: sepia(${value});`;
  }

  // Aspect Ratio
  if (className === 'aspect-auto') return 'aspect-ratio: auto;';
  if (className === 'aspect-square') return 'aspect-ratio: 1 / 1;';
  if (className === 'aspect-video') return 'aspect-ratio: 16 / 9;';

  // Columns
  if (className.startsWith('columns-')) {
    const value = className.replace('columns-', '');
    if (value === 'auto') return 'columns: auto;';
    if (value === '3xs') return 'columns: 16rem;';
    if (value === '2xs') return 'columns: 18rem;';
    if (value === 'xs') return 'columns: 20rem;';
    if (value === 'sm') return 'columns: 24rem;';
    if (value === 'md') return 'columns: 28rem;';
    if (value === 'lg') return 'columns: 32rem;';
    if (value === 'xl') return 'columns: 36rem;';
    if (value === '2xl') return 'columns: 42rem;';
    if (value === '3xl') return 'columns: 48rem;';
    if (value === '4xl') return 'columns: 56rem;';
    if (value === '5xl') return 'columns: 64rem;';
    if (value === '6xl') return 'columns: 72rem;';
    if (value === '7xl') return 'columns: 80rem;';
    return `columns: ${value};`;
  }

  // Break After/Before/Inside
  if (className === 'break-after-auto') return 'break-after: auto;';
  if (className === 'break-after-avoid') return 'break-after: avoid;';
  if (className === 'break-after-all') return 'break-after: all;';
  if (className === 'break-after-avoid-page') return 'break-after: avoid-page;';
  if (className === 'break-after-page') return 'break-after: page;';
  if (className === 'break-after-left') return 'break-after: left;';
  if (className === 'break-after-right') return 'break-after: right;';
  if (className === 'break-after-column') return 'break-after: column;';

  if (className === 'break-before-auto') return 'break-before: auto;';
  if (className === 'break-before-avoid') return 'break-before: avoid;';
  if (className === 'break-before-all') return 'break-before: all;';
  if (className === 'break-before-avoid-page') return 'break-before: avoid-page;';
  if (className === 'break-before-page') return 'break-before: page;';
  if (className === 'break-before-left') return 'break-before: left;';
  if (className === 'break-before-right') return 'break-before: right;';
  if (className === 'break-before-column') return 'break-before: column;';

  if (className === 'break-inside-auto') return 'break-inside: auto;';
  if (className === 'break-inside-avoid') return 'break-inside: avoid;';
  if (className === 'break-inside-avoid-page') return 'break-inside: avoid-page;';
  if (className === 'break-inside-avoid-column') return 'break-inside: avoid-column;';

  // Box Decoration Break
  if (className === 'box-decoration-clone') return 'box-decoration-break: clone;';
  if (className === 'box-decoration-slice') return 'box-decoration-break: slice;';

  // Isolation
  if (className === 'isolate') return 'isolation: isolate;';
  if (className === 'isolation-auto') return 'isolation: auto;';

  // Mix Blend Mode
  const mixBlendModes: Record<string, string> = {
    'mix-blend-normal': 'normal',
    'mix-blend-multiply': 'multiply',
    'mix-blend-screen': 'screen',
    'mix-blend-overlay': 'overlay',
    'mix-blend-darken': 'darken',
    'mix-blend-lighten': 'lighten',
    'mix-blend-color-dodge': 'color-dodge',
    'mix-blend-color-burn': 'color-burn',
    'mix-blend-hard-light': 'hard-light',
    'mix-blend-soft-light': 'soft-light',
    'mix-blend-difference': 'difference',
    'mix-blend-exclusion': 'exclusion',
    'mix-blend-hue': 'hue',
    'mix-blend-saturation': 'saturation',
    'mix-blend-color': 'color',
    'mix-blend-luminosity': 'luminosity',
  };
  if (className in mixBlendModes) return `mix-blend-mode: ${mixBlendModes[className]};`;

  // Background Blend Mode
  const bgBlendModes: Record<string, string> = {
    'bg-blend-normal': 'normal',
    'bg-blend-multiply': 'multiply',
    'bg-blend-screen': 'screen',
    'bg-blend-overlay': 'overlay',
    'bg-blend-darken': 'darken',
    'bg-blend-lighten': 'lighten',
    'bg-blend-color-dodge': 'color-dodge',
    'bg-blend-color-burn': 'color-burn',
    'bg-blend-hard-light': 'hard-light',
    'bg-blend-soft-light': 'soft-light',
    'bg-blend-difference': 'difference',
    'bg-blend-exclusion': 'exclusion',
    'bg-blend-hue': 'hue',
    'bg-blend-saturation': 'saturation',
    'bg-blend-color': 'color',
    'bg-blend-luminosity': 'luminosity',
  };
  if (className in bgBlendModes) return `background-blend-mode: ${bgBlendModes[className]};`;

  return null;
};