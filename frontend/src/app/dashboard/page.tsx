'use client';

import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Switch } from '@nextui-org/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Component } from '@/types';
import { useComponents, useProfile, useDeleteComponent, useUpdateComponent } from '@/hooks/queries';

export default function Dashboard() {
  const router = useRouter();
  const { data: user } = useProfile();
  const { data: componentList, isLoading } = useComponents();
  const deleteComponent = useDeleteComponent();
  const updateComponent = useUpdateComponent();

  const apiKey = user?.apiKeys?.find(k => k.isActive)?.key || '';

  const handleDelete = async (id: string) => {
    try {
      await deleteComponent.mutateAsync(id);
      toast.success('Component deleted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'An error occurred while deleting component!');
    }
  };

  const handleStatusChange = async (component: Component) => {
    try {
      await updateComponent.mutateAsync({
        id: component._id,
        data: { isActive: !component.isActive }
      });
      toast.success('Status updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
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
          {isLoading ? (
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
                        isDisabled={updateComponent.isPending}
                      />
                      <Button
                        as={Link}
                        href={`/dashboard/components/edit/${component._id}`}
                        color="primary"
                        variant="light"
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        variant="light"
                        onClick={() => handleDelete(component._id)}
                        isLoading={deleteComponent.isPending}
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
          
          {componentList?.length === 0 && !isLoading && (
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