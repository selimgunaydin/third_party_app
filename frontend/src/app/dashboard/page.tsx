'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Switch } from '@nextui-org/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Cookies from 'js-cookie';

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
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get user information and API key
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => {
      if (data.apiKeys && data.apiKeys.length > 0) {
        setApiKey(data.apiKeys[0]); // Use first API key
      }
    })
    .catch(err => {
      console.error(err);
      toast.error('Failed to get user information!');
    });

    // Get components
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/components`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setComponents(data);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [router]);

  const handleDelete = async (id: string) => {
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/components/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        mode: 'cors'
      });

      if (!res.ok) {
        throw new Error('Component could not be deleted');
      }

      // Reload components
      const updatedComponents = components.filter(c => c._id !== id);
      setComponents(updatedComponents);
      toast.success('Component deleted successfully!');
    } catch (err) {
      console.error('Error deleting component:', err);
      toast.error('Error deleting component!');
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
            components.map((component) => (
              <Card key={component._id} className="hover:shadow-md transition-shadow">
                <CardBody>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{component.name}</h3>
                    <div className="flex items-center gap-4">
                      <Switch
                        defaultSelected={component.isActive}  
                        checked={component.isActive}
                        onChange={async () => {
                          try {
                            const token = Cookies.get('token');
                            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/components/${component._id}`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({
                                isActive: !component.isActive
                              }),
                              credentials: 'include',
                              mode: 'cors'
                            });

                            if (!res.ok) {
                              throw new Error('Status could not be updated');
                            }

                            const updatedComponents = components.map(c =>
                              c._id === component._id ? { ...c, isActive: !c.isActive } : c
                            );
                            setComponents(updatedComponents);
                            toast.success('Status updated successfully!');
                          } catch (err) {
                            console.error('Error updating status:', err);
                            toast.error('Error updating status!');
                          }
                        }}
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
                        onPress={() => handleDelete(component._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Selector: {component.selector}</p>
                  <p className="text-sm text-gray-600">Position: {component.position}</p>
                </CardBody>
              </Card>
            ))
          )}
          
          {components.length === 0 && !loading && (
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