'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Input, Select, SelectItem } from '@nextui-org/react';
import Editor from '@monaco-editor/react';

interface Component {
  _id: string;
  name: string;
  selector: string;
  position: 'before' | 'after';
  html: string;
  css: string;
  javascript: string;
  isTemplate?: boolean;
  isActive: boolean;
}

const defaultTemplates: Omit<Component, '_id'>[] = [
  {
    name: 'Basit Banner',
    selector: '#banner',
    position: 'after',
    html: '<div class="banner">Özel Banner İçeriği</div>',
    css: `.banner {
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  margin: 10px 0;
}`,
    javascript: '',
    isTemplate: true,
    isActive: true
  },
  {
    name: 'Popup Form',
    selector: '#popup-container',
    position: 'after',
    html: `<div class="popup">
  <div class="popup-content">
    <h3>İletişime Geçin</h3>
    <form id="contact-form">
      <input type="email" placeholder="Email" required>
      <textarea placeholder="Mesajınız" required></textarea>
      <button type="submit">Gönder</button>
    </form>
  </div>
</div>`,
    css: `.popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 8px;
  padding: 20px;
  width: 300px;
}
.popup-content h3 {
  margin-bottom: 15px;
}
.popup-content input,
.popup-content textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.popup-content button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}`,
    javascript: `document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Form gönderildi!');
});`,
    isTemplate: true,
    isActive: true
  }
];

export default function NewComponent() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [selector, setSelector] = useState('');
  const [position, setPosition] = useState<'before' | 'after'>('after');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [javascript, setJavascript] = useState('');
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleTemplateChange = (templateId: string) => {
    if (templateId) {
      const template = defaultTemplates.find((t, index) => index.toString() === templateId);
      if (template) {
        setName(template.name);
        setSelector(template.selector);
        setPosition(template.position);
        setHtml(template.html);
        setCss(template.css);
        setJavascript(template.javascript);
      }
    } else {
      // Template seçimi kaldırıldığında formu temizle
      setName('');
      setSelector('');
      setPosition('after');
      setHtml('');
      setCss('');
      setJavascript('');
    }
    setSelectedTemplate(templateId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/components`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          selector,
          position,
          html,
          css,
          javascript,
          isActive: true
        }),
        credentials: 'include',
        mode: 'cors'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Component oluşturma başarısız');
      }

      // Dashboard'a yönlendir
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Bir hata oluştu');
      }
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">Yeni Component</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Select
                  label="Template Seç"
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                >
                  <SelectItem key="empty" value="">Boş Template</SelectItem>
                  {defaultTemplates.map((template, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {template.name}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Component Adı"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <div className="flex gap-4">
                  <Input
                    label="Selector"
                    value={selector}
                    onChange={(e) => setSelector(e.target.value)}
                    placeholder="#my-widget"
                    className="flex-1"
                    required
                  />
                  <Select
                    label="Pozisyon"
                    value={position}
                    onChange={(e) => setPosition(e.target.value as 'before' | 'after')}
                    className="w-48"
                  >
                    <SelectItem key="before" value="before">Öncesine</SelectItem>
                    <SelectItem key="after" value="after">Sonrasına</SelectItem>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm mb-2">HTML</label>
                  <Editor
                    height="200px"
                    defaultLanguage="html"
                    value={html}
                    onChange={(value) => setHtml(value || '')}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">CSS</label>
                  <Editor
                    height="200px"
                    defaultLanguage="css"
                    value={css}
                    onChange={(value) => setCss(value || '')}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">JavaScript</label>
                  <Editor
                    height="200px"
                    defaultLanguage="javascript"
                    value={javascript}
                    onChange={(value) => setJavascript(value || '')}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <div className="flex gap-4">
                  <Button type="submit" color="primary">
                    Component Oluştur
                  </Button>
                  <Button color="default" onClick={() => router.push('/dashboard')}>
                    İptal
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">Önizleme</h2>
              <div className="border rounded p-4">
                <style dangerouslySetInnerHTML={{ __html: css }} />
                <div dangerouslySetInnerHTML={{ __html: html }} />
                {javascript && (
                  <script dangerouslySetInnerHTML={{ __html: javascript }} />
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
} 