'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button } from '@nextui-org/react';
import { HiPlus, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { auth } from '@/lib/api';
import { User as ApiUser } from '@/types';

interface User extends ApiUser {
  apiKeys: string[];
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    auth.getProfile()
      .then(data => {
        setUser(data as User);
      })
      .catch((err: any) => {
        console.error(err);
        if (err.response?.status === 401) {
          Cookies.remove('access_token');
          router.push('/login');
          return;
        }
        toast.error('Kullanıcı bilgileri alınamadı!');
      });
  }, [router]);

  const handleCreateApiKey = async () => {
    setIsLoading(true);
    try {
      const response = await auth.generateApiKey();
      setUser(prev => prev ? {
        ...prev,
        apiKeys: [...prev.apiKeys, response.apiKey]
      } : null);
      toast.success('API key başarıyla oluşturuldu!');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        Cookies.remove('access_token');
        router.push('/login');
        return;
      }
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
      await auth.deleteApiKey(apiKey);
      setUser(prev => prev ? {
        ...prev,
        apiKeys: prev.apiKeys.filter(key => key !== apiKey)
      } : null);
      toast.success('API key başarıyla silindi!');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        Cookies.remove('access_token');
        router.push('/login');
        return;
      }
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