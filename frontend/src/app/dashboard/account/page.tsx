'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button } from '@nextui-org/react';
import { HiPlus, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface User {
  name: string;
  email: string;
  apiKeys: string[];
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      mode: 'cors'
    })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          Cookies.remove('token');
          router.push('/login');
          return;
        }
        throw new Error('Failed to get user information');
      }
      return res.json();
    })
    .then(data => {
      setUser(data);
    })
    .catch(err => {
      console.error(err);
      toast.error('Kullanıcı bilgileri alınamadı!');
    });
  }, [router]);

  const handleCreateApiKey = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/api-key`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        mode: 'cors'
      });

      if (!res.ok) {
        if (res.status === 401) {
          Cookies.remove('token');
          router.push('/login');
          return;
        }
        throw new Error('API key oluşturulamadı');
      }

      const data = await res.json();
      setUser(prev => prev ? {
        ...prev,
        apiKeys: [...prev.apiKeys, data.apiKey]
      } : null);
      toast.success('API key başarıyla oluşturuldu!');
    } catch (err) {
      console.error(err);
      toast.error('API key oluşturulurken hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApiKey = async (apiKey: string) => {
    if (!user || user.apiKeys.length <= 1) {
      toast.error('En az bir API key\'iniz olmak zorunda!');
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/api-key/${apiKey}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        mode: 'cors'
      });

      if (!res.ok) {
        if (res.status === 401) {
          Cookies.remove('token');
          router.push('/login');
          return;
        }
        throw new Error('API key silinemedi');
      }

      setUser(prev => prev ? {
        ...prev,
        apiKeys: prev.apiKeys.filter(key => key !== apiKey)
      } : null);
      toast.success('API key başarıyla silindi!');
    } catch (err) {
      console.error(err);
      toast.error('API key silinirken hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-[200px]">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen space-y-8">
      <h1 className="text-2xl font-bold">Hesap Ayarları</h1>
      <div className="space-y-6">
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">Hesap Bilgileri</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Ad Soyad:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">E-posta:</span> {user.email}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">API Keys</h2>
              <Button
                color="primary"
                startContent={<HiPlus className="w-4 h-4" />}
                onClick={handleCreateApiKey}
                isLoading={isLoading}
              >
                Yeni API Key
              </Button>
            </div>

            <div className="space-y-3">
              {user.apiKeys?.map((apiKey) => (
                <div
                  key={apiKey}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <code className="text-sm bg-white px-3 py-1 rounded border">
                    {apiKey}
                  </code>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    onClick={() => handleDeleteApiKey(apiKey)}
                    isDisabled={isLoading || user.apiKeys.length === 1}
                  >
                    <HiTrash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-4">
              * En az bir API key'iniz olmak zorunda. API key'ler widget entegrasyonu için kullanılır.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
} 