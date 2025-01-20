'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Input, Select, SelectItem } from '@nextui-org/react';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import Preview from '@/components/Preview';

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
  const { id } = use(params);
  const router = useRouter();
  const [component, setComponent] = useState<Component | null>(null);
  const [name, setName] = useState('');
  const [selector, setSelector] = useState('');
  const [position, setPosition] = useState<'before' | 'after'>('after');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [javascript, setJavascript] = useState('');
  const [error, setError] = useState('');
  const [isCheckingSelector, setIsCheckingSelector] = useState(false);
  const [originalSelector, setOriginalSelector] = useState('');

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
        setOriginalSelector(data.selector);
        setPosition(data.position || 'after');
        setHtml(data.html);
        setCss(data.css);
        setJavascript(data.javascript);
        toast.success('Component başarıyla yüklendi!');
      }
    })
    .catch(err => {
      console.error(err);
      toast.error('Component yüklenirken hata oluştu!');
    });
  }, [id, router]);

  // Selector değiştiğinde kontrol et (eğer orijinal selector'dan farklıysa)
  const checkSelector = async (value: string) => {
    if (!value || value === originalSelector) return;
    
    setIsCheckingSelector(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/components/check-selector?selector=${encodeURIComponent(value)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      const data = await res.json();
      
      if (data.exists) {
        toast.error('Bu selector zaten kullanımda!');
        setError('Bu selector zaten kullanımda. Lütfen başka bir selector seçin.');
      } else {
        setError('');
      }
    } catch (err) {
      console.error('Selector kontrol hatası:', err);
    } finally {
      setIsCheckingSelector(false);
    }
  };

  // Selector değişikliğini yönet
  const handleSelectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelector(value);
    setError('');
    
    // Debounce ile selector kontrolü
    const timeoutId = setTimeout(() => {
      checkSelector(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isCheckingSelector) {
      toast.error('Lütfen selector kontrolünün tamamlanmasını bekleyin.');
      return;
    }

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

      toast.success('Component başarıyla güncellendi!');
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message);
      } else {
        toast.error('Bir hata oluştu');
        setError('Bir hata oluştu');
      }
    }
  };

  if (!component) {
    return <div className='min-h-screen flex justify-center items-center'>Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    onChange={handleSelectorChange}
                    placeholder="#my-widget"
                    className="flex-1"
                    required
                    isInvalid={!!error}
                    errorMessage={error}
                    description="Benzersiz bir CSS seçici girin"
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

          <div className="space-y-4">
            <Card>
              <CardBody>
                <h2 className="text-xl font-semibold mb-4">Önizleme</h2>
                <Preview
                  html={html}
                  css={css}
                  javascript={javascript}
                  className="bg-gray-50"
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 