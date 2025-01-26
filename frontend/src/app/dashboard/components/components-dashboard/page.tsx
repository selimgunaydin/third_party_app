'use client';

import { Card, CardBody, Button, Switch } from '@nextui-org/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Component } from '@/types';
import { useComponents, useDeleteComponent, useUpdateComponent } from '@/hooks/queries';

export default function ComponentsDashboard() {
  const { data: componentList, isLoading } = useComponents();
  const deleteComponent = useDeleteComponent();
  const updateComponent = useUpdateComponent();

  const handleDelete = async (id: string) => {
    try {
      await deleteComponent.mutateAsync(id);
      toast.success('Component deleted successfully!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
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
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Components</h1>
        </div>

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