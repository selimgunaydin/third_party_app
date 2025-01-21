'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button } from '@nextui-org/react';
import { HiPlus, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { auth } from '@/lib/api';
import { User as ApiUser } from '@/types';
import { AxiosError } from 'axios';

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
      .catch((err: AxiosError) => {
        console.error(err);
        if (err.response?.status === 401) {
          Cookies.remove('access_token');
          router.push('/login');
          return;
        }
        toast.error('Failed to load user information!');
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
      toast.success('API key created successfully!');
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError && err.response?.status === 401) {
        Cookies.remove('access_token');
        router.push('/login');
        return;
      }
      toast.error('Error creating API key!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApiKey = async (apiKey: string) => {
    if (!user || user.apiKeys.length <= 1) {
      toast.error('You must have at least one API key!');
      return;
    }

    setIsLoading(true);
    try {
      await auth.deleteApiKey(apiKey);
      setUser(prev => prev ? {
        ...prev,
        apiKeys: prev.apiKeys.filter(key => key !== apiKey)
      } : null);
      toast.success('API key deleted successfully!');
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError && err.response?.status === 401) {
        Cookies.remove('access_token');
        router.push('/login');
        return;
      }
      toast.error('Error deleting API key!');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
  }

  return (
    <div className="min-h-screen space-y-8">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Full Name:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
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
                New API Key
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
              * You must have at least one API key. API keys are used for widget integration.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
} 