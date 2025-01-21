'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, CardBody, Input, Select, SelectItem } from '@nextui-org/react';
import Editor from '@monaco-editor/react';
import { defaultComponents } from '@/data/defaultComponents';
import toast from 'react-hot-toast';
import Preview from '@/components/Preview';
import Cookies from 'js-cookie';
import { components } from '@/lib/api';
import { AxiosError } from 'axios';

function NewComponentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [selector, setSelector] = useState('');
  const [position, setPosition] = useState<'before' | 'after'>('after');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [javascript, setJavascript] = useState('');
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // URL'den template parametresini al
    const templateId = searchParams.get('template');
    if (templateId) {
      // Default components içinden seçili olanı bul
      const template = defaultComponents.find(c => c.id === templateId);
      if (template) {
        setName(template.name);
        setSelector('');
        setPosition('after');
        setHtml(template.html);
        setCss(template.css);
        setJavascript(template.javascript);
        setSelectedTemplate(templateId);
        toast.success('Template başarıyla yüklendi!');
      }
    }
  }, [searchParams]);

  const handleTemplateChange = (templateId: string) => {
    if (templateId) {
      const template = defaultComponents.find(c => c.id === templateId);
      if (template) {
        setName(template.name);
        setSelector('');
        setPosition('after');
        setHtml(template.html);
        setCss(template.css);
        setJavascript(template.javascript);
        toast.success('Template başarıyla yüklendi!');
      }
    } else {
      setName('');
      setSelector('');
      setPosition('after');
      setHtml('');
      setCss('');
      setJavascript('');
    }
    setSelectedTemplate(templateId);
  };

  // Selector değişikliğini yönet
  const handleSelectorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelector(value);
    setError('');

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Önce selector kontrolü yap
      if (!selector) {
        setError('Selector alanı zorunludur');
        setIsLoading(false);
        return;
      }

      const token = Cookies.get('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      await components.create({
        name,
        selector,
        position,
        html,
        css,
        javascript,
        isActive: true
      });

      toast.success('Component başarıyla oluşturuldu!');
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          Cookies.remove('access_token');
          router.push('/login');
          return;
        }

        // Selector duplicate hatası kontrolü
        if (err.response?.data?.code === 'DUPLICATE_SELECTOR') {
          setError(err.response.data.message);
          setIsLoading(false);
          return;
        }

        toast.error(err.response?.data?.message || 'Component oluşturma başarısız');
        setError(err.response?.data?.message || 'Component oluşturma başarısız');
      } else {
        toast.error('Bir hata oluştu');
        setError('Bir hata oluştu');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const templateOptions = [
    { id: "", name: "Boş Template" },
    ...defaultComponents
  ];

  return (
    <div className="min-h-screen space-y-8">
      <h1 className="text-2xl font-bold">Default Components</h1>
      <div className="max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">Yeni Component</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Select
                  label="Template Seç"
                  selectedKeys={selectedTemplate ? [selectedTemplate] : []}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                >
                  {templateOptions.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
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
                  <Button type="submit" color="primary" isLoading={isLoading}>
                    Component Oluştur
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

export default function NewComponent() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <NewComponentForm />
    </Suspense>
  );
} 