'use client';

import { useEffect, useState } from 'react';
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
    isTemplate: true
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
    isTemplate: true
  }
];

export default function Dashboard() {
  const router = useRouter();
  const [components, setComponents] = useState<Component[]>([]);
  const [name, setName] = useState('');
  const [selector, setSelector] = useState('');
  const [position, setPosition] = useState<'before' | 'after'>('after');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [javascript, setJavascript] = useState('');
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Kullanıcı bilgilerini ve API key'i al
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => {
      if (data.apiKey) {
        setApiKey(data.apiKey);
      }
    })
    .catch(console.error);

    // Componentleri getir
    fetchComponents();
  }, [router]);

  const fetchComponents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/components`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        mode: 'cors'
      });
      const data = await res.json();
      if (res.ok) {
        setComponents(data);
      }
    } catch (err) {
      console.error('Components yüklenirken hata:', err);
    }
  };

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
          javascript
        }),
        credentials: 'include',
        mode: 'cors'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Component oluşturma başarısız');
      }

      // Formu temizle
      setName('');
      setSelector('');
      setPosition('after');
      setHtml('');
      setCss('');
      setJavascript('');
      setSelectedTemplate('');

      // Componentleri yeniden yükle
      fetchComponents();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Bir hata oluştu');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button color="danger" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </div>

        {apiKey && (
          <Card className="mb-8">
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">Widget Entegrasyon Kodu</h2>
              <code className="block bg-gray-100 p-4 rounded">
                {`<script defer src="${process.env.NEXT_PUBLIC_API_URL}/widget/${apiKey}"></script>`}
              </code>
            </CardBody>
          </Card>
        )}

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
                <Button type="submit" color="primary">
                  Component Oluştur
                </Button>
              </form>
            </CardBody>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">Componentlerim</h2>
            <div className="space-y-4">
              {components.map((component) => (
                <Card key={component._id}>
                  <CardBody>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{component.name}</h3>
                        <p className="text-sm text-gray-600">
                          Selector: {component.selector} ({component.position === 'before' ? 'Öncesine' : 'Sonrasına'})
                        </p>
                      </div>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => router.push(`/dashboard/edit/${component._id}`)}
                      >
                        Düzenle
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 