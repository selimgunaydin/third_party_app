'use client';

import { use, useEffect, useState } from 'react';
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
}

export default function EditComponent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // `params` burada unwrap edilir.
  const router = useRouter();
  const [component, setComponent] = useState<Component | null>(null);
  const [name, setName] = useState('');
  const [selector, setSelector] = useState('');
  const [position, setPosition] = useState<'before' | 'after'>('after');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [javascript, setJavascript] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Component'i getir
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/components/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => {
      if (data._id) {
        setComponent(data);
        setName(data.name);
        setSelector(data.selector);
        setPosition(data.position || 'after');
        setHtml(data.html);
        setCss(data.css);
        setJavascript(data.javascript);
      }
    })
    .catch(console.error);
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/components/${id}`, {
        method: 'PATCH',
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
        throw new Error(data.error || 'Component güncelleme başarısız');
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

  if (!component) {
    return <div className='min-h-screen flex justify-center items-center'>Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardBody>
            <h1 className="text-2xl font-bold mb-6">Component Düzenle</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  defaultSelectedKeys={[position]}
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
                  Kaydet
                </Button>
                <Button color="default" onClick={() => router.push('/dashboard')}>
                  İptal
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
} 