'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Input, Select, SelectItem } from '@nextui-org/react';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import Preview from '@/components/Preview';
import Cookies from 'js-cookie';
import { components } from '@/lib/api';
import { AxiosError } from 'axios';
import { Component } from '@/types';

export default function EditComponent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [component, setComponent] = useState<Component | null>(null);
  const [name, setName] = useState('');
  const [selector, setSelector] = useState('');
  const [position, setPosition] = useState<'before' | 'after'>('after');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [javascript, setJavascript] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const data = await components.getOne(params.id);
        setComponent(data);
        setName(data.name);
        setSelector(data.selector);
        setPosition(data.position);
        setHtml(data.html);
        setCss(data.css);
        setJavascript(data.javascript);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            Cookies.remove('access_token');
            router.push('/login');
            return;
          }
          toast.error(err.response?.data?.message || 'Failed to load component');
        } else {
          console.error(err);
          toast.error('An error occurred while loading the component!');
        }
      }
    };

    fetchComponent();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = Cookies.get('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      await components.update(params.id, {
        name,
        selector,
        position,
        html,
        css,
        javascript
      });

      toast.success('Component updated successfully!');
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          Cookies.remove('access_token');
          router.push('/login');
          return;
        }
        toast.error(err.response?.data?.message || 'Failed to update component');
      } else {
        console.error(err);
        toast.error('An error occurred while updating the component!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!component) {
    return (
      <div className="p-6">
        <Card>
          <CardBody>
            <p className="text-center">Loading...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Component</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Component Name</h3>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter component name"
                  required
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">CSS Selector</h3>
                <Input
                  value={selector}
                  onChange={(e) => setSelector(e.target.value)}
                  placeholder="Enter CSS selector (e.g. #header)"
                  required
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Position</h3>
                <Select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as 'before' | 'after')}
                  required
                >
                  <SelectItem key="before" value="before">Before</SelectItem>
                  <SelectItem key="after" value="after">After</SelectItem>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">HTML</h3>
                <Editor
                  height="200px"
                  defaultLanguage="html"
                  value={html}
                  onChange={(value) => setHtml(value || '')}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">CSS</h3>
                <Editor
                  height="200px"
                  defaultLanguage="css"
                  value={css}
                  onChange={(value) => setCss(value || '')}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">JavaScript</h3>
                <Editor
                  height="200px"
                  defaultLanguage="javascript"
                  value={javascript}
                  onChange={(value) => setJavascript(value || '')}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" color="primary" isLoading={isLoading}>
                  Save
                </Button>
                <Button variant="bordered" onPress={() => router.push('/dashboard')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
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
  );
} 