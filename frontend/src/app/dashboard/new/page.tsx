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
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { componentSchema } from '@/lib/validations';

type ComponentFormData = {
  name: string;
  selector: string;
  position: 'before' | 'after';
  html: string;
  css: string;
  javascript: string;
  isActive: boolean;
};

function NewComponentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ComponentFormData>({
    resolver: yupResolver(componentSchema),
    defaultValues: {
      position: 'after',
      isActive: true,
      css: '',
      javascript: '',
      html: '',
      name: '',
      selector: ''
    },
  });

  useEffect(() => {
    // URL'den template parametresini al
    const templateId = searchParams.get('template');
    if (templateId) {
      // Default components içinden seçili olanı bul
      const template = defaultComponents.find(c => c.id === templateId);
      if (template) {
        setValue('name', template.name);
        setValue('selector', '');
        setValue('position', 'after');
        setValue('html', template.html);
        setValue('css', template.css);
        setValue('javascript', template.javascript);
        setSelectedTemplate(templateId);
        toast.success('Template başarıyla yüklendi!');
      }
    }
  }, [searchParams, setValue]);

  const handleTemplateChange = (templateId: string) => {
    if (templateId) {
      const template = defaultComponents.find(c => c.id === templateId);
      if (template) {
        setValue('name', template.name);
        setValue('selector', '');
        setValue('position', 'after');
        setValue('html', template.html);
        setValue('css', template.css);
        setValue('javascript', template.javascript);
        toast.success('Template başarıyla yüklendi!');
      }
    } else {
      setValue('name', '');
      setValue('selector', '');
      setValue('position', 'after');
      setValue('html', '');
      setValue('css', '');
      setValue('javascript', '');
    }
    setSelectedTemplate(templateId);
  };

  const onSubmit = async (data: ComponentFormData) => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      await components.create({
        ...data,
        css: data.css || '',
        javascript: data.javascript || ''
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
          setError('selector', {
            type: 'manual',
            message: err.response.data.message,
          });
          return;
        }

        toast.error(err.response?.data?.message || 'Component oluşturma başarısız');
      } else {
        toast.error('Bir hata oluştu');
      }
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
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                  {...register('name')}
                  label="Component Adı"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                />
                <div className="flex gap-4">
                  <Input
                    {...register('selector')}
                    label="Selector"
                    placeholder="#my-widget"
                    className="flex-1"
                    isInvalid={!!errors.selector}
                    errorMessage={errors.selector?.message}
                    description="Benzersiz bir CSS seçici girin"
                  />
                  <Controller
                    name="position"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Pozisyon"
                        selectedKeys={[field.value]}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-48"
                        isInvalid={!!errors.position}
                        errorMessage={errors.position?.message}
                      >
                        <SelectItem key="before" value="before">Öncesine</SelectItem>
                        <SelectItem key="after" value="after">Sonrasına</SelectItem>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">HTML</label>
                  <Controller
                    name="html"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Editor
                          height="200px"
                          defaultLanguage="html"
                          value={field.value}
                          onChange={(value) => field.onChange(value || '')}
                          options={{
                            minimap: { enabled: false },
                          }}
                        />
                        {errors.html && (
                          <p className="text-danger text-sm mt-1">{errors.html.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">CSS</label>
                  <Controller
                    name="css"
                    control={control}
                    render={({ field }) => (
                      <Editor
                        height="200px"
                        defaultLanguage="css"
                        value={field.value}
                        onChange={(value) => field.onChange(value || '')}
                        options={{
                          minimap: { enabled: false },
                        }}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">JavaScript</label>
                  <Controller
                    name="javascript"
                    control={control}
                    render={({ field }) => (
                      <Editor
                        height="200px"
                        defaultLanguage="javascript"
                        value={field.value}
                        onChange={(value) => field.onChange(value || '')}
                        options={{
                          minimap: { enabled: false },
                        }}
                      />
                    )}
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" color="primary" isLoading={isSubmitting}>
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
                  html={control._formValues.html || ''}
                  css={control._formValues.css || ''}
                  javascript={control._formValues.javascript || ''}
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