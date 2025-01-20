'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Switch } from '@nextui-org/react';

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

export default function Dashboard() {
  const router = useRouter();
  const [components, setComponents] = useState<Component[]>([]);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');

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

  const handleDelete = async (id: string) => {
    if (!confirm('Bu componenti silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/components/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        mode: 'cors'
      });

      if (!res.ok) {
        throw new Error('Component silinemedi');
      }

      // Componentleri yeniden yükle
      fetchComponents();
    } catch (err) {
      console.error('Component silme hatası:', err);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/components/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isActive: !currentStatus
        }),
        credentials: 'include',
        mode: 'cors'
      });

      if (!res.ok) {
        throw new Error('Component durumu güncellenemedi');
      }

      // Componentleri yeniden yükle
      fetchComponents();
    } catch (err) {
      console.error('Component güncelleme hatası:', err);
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
          <div className="flex gap-4">
            <Button
              color="primary"
              onClick={() => router.push('/dashboard/new')}
            >
              Yeni Component
            </Button>
            <Button color="danger" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </div>
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

        <div>
          <h2 className="text-xl font-semibold mb-4">Componentlerim</h2>
          <div className="space-y-4">
            {components.map((component) => (
              <Card key={component._id}>
                <CardBody>
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold">{component.name}</h3>
                      <p className="text-sm text-gray-600">
                        Selector: {component.selector} ({component.position === 'before' ? 'Öncesine' : 'Sonrasına'})
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Switch
                        defaultSelected={component.isActive}
                        size="sm"
                        onChange={() => handleToggleActive(component._id, component.isActive)}
                        aria-label="Aktif/Pasif"
                      />
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => router.push(`/dashboard/edit/${component._id}`)}
                      >
                        Düzenle
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(component._id)}
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 