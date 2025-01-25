export const convertTailwindToCSS = async (html: string | any): Promise<string> => {
  try {
    // HTML kontrolü
    if (!html) {
      console.error('HTML içeriği boş olamaz');
      return '';
    }

    // HTML'i string'e dönüştür
    const htmlString = typeof html === 'string' ? html : String(html);

    const response = await fetch('/api/convert-tailwind', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html: htmlString }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'CSS dönüştürme işlemi başarısız oldu');
    }

    const { css } = await response.json();
    return css || '';
  } catch (error) {
    console.error('CSS dönüştürme hatası:', error);
    return '';
  }
}; 