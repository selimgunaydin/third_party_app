'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Switch } from '@nextui-org/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { auth, components } from '@/lib/api';
import { AxiosError } from 'axios';
import { Component } from '@/types';

export default function Dashboard() {
  const router = useRouter();
  const [componentList, setComponentList] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');

  const fetchComponents = async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const data = await components.getAll();
      setComponentList(data);
      setLoading(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          Cookies.remove('access_token');
          router.push('/login');
          return;
        }
        toast.error(err.response?.data?.message || 'Failed to load components');
      } else {
        console.error(err);
        toast.error('An error occurred while loading components!');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get user information and API key
    auth.getProfile()
      .then(data => {
        if (data.apiKeys && data.apiKeys.length > 0) {
          const activeKey = data.apiKeys.find(k => k.isActive);
          if (activeKey) {
            setApiKey(activeKey.key);
          }
        }
      })
      .catch(err => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            Cookies.remove('access_token');
            router.push('/login');
            return;
          }
          toast.error(err.response?.data?.message || 'Failed to load user information');
        } else {
          console.error(err);
          toast.error('Failed to load user information!');
        }
      });

    fetchComponents();
  }, [router]);

  const handleDelete = async (id: string) => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      await components.delete(id);
      const updatedComponents = componentList.filter(c => c._id !== id);
      setComponentList(updatedComponents);
      toast.success('Component deleted successfully!');
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          Cookies.remove('access_token');
          router.push('/login');
          return;
        }
        toast.error(err.response?.data?.message || 'An error occurred while deleting component!');
      } else {
        console.error('Error deleting component:', err);
        toast.error('An error occurred while deleting component!');
      }
    }
  };

  const handleStatusChange = async (component: Component) => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      await components.update(component._id, {
        isActive: !component.isActive
      });

      const updatedComponents = componentList?.map(c =>
        c._id === component._id ? { ...c, isActive: !c.isActive } : c
      );
      setComponentList(updatedComponents);
      toast.success('Status updated successfully!');
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          Cookies.remove('access_token');
          router.push('/login');
          return;
        }
        toast.error(err.response?.data?.message || 'Failed to update status');
      } else {
        console.error('Error updating status:', err);
        toast.error('An error occurred while updating status!');
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <Button
              as={Link}
              href="/dashboard/default-components"
              variant="light"
            >
              Default Components
            </Button>
            <Button
              as={Link}
              href="/dashboard/new"
              color="primary"
            >
              New Component
            </Button>
          </div>
        </div>

        {apiKey ? (
          <Card className="bg-gray-50">
            <CardBody>
              <h2 className="text-lg font-semibold mb-2">Widget Integration</h2>
              <p className="text-sm text-gray-600 mb-4">
                Add the following code between the &lt;head&gt; or &lt;body&gt; tags of your HTML page to integrate the widget:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs">
                {`<script defer src="${process.env.NEXT_PUBLIC_API_URL}/widget.js?apiKey=${apiKey}"></script>`}
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card className="bg-yellow-50">
            <CardBody>
              <h2 className="text-lg font-semibold mb-2 text-yellow-800">API Key Required</h2>
              <p className="text-sm text-yellow-700">
                You need an API key to see the widget integration code. Please create an API key in your account settings.
              </p>
            </CardBody>
          </Card>
        )}

        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardBody>
                <p className="text-center">Loading...</p>
              </CardBody>
            </Card>
          ) : (
            componentList?.map((component) => (
              <Card key={component._id} className="hover:shadow-md transition-shadow">
                <CardBody>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{component.name}</h3>
                    <div className="flex items-center gap-4">
                      <Switch
                        defaultSelected={component.isActive}
                        onChange={() => handleStatusChange(component)}
                      />
                      <Button
                        as={Link}
                        href={`/dashboard/edit/${component._id}`}
                        color="primary"
                        variant="light"
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        variant="light"
                        onClick={() => handleDelete(component._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Selector: <code>{component.selector}</code></p>
                    <p>Position: {component.position}</p>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
          
          {componentList?.length === 0 && !loading && (
            <Card>
              <CardBody>
                <p className="text-center text-gray-500">
                  No components added yet. Add your first component now!
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 