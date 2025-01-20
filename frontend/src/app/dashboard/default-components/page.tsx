'use client';

import { useState } from 'react';
import { defaultComponents, DefaultComponent } from '@/data/defaultComponents';
import { useRouter } from 'next/navigation';
import Preview from '@/components/Preview';
import { Button } from '@nextui-org/react';

export default function DefaultComponentsPage() {
  const router = useRouter();
  const [selectedComponent, setSelectedComponent] = useState<DefaultComponent | null>(null);

  const handleSelectComponent = () => {
    if (!selectedComponent) return;
    
    // Template ID'sini URL parametresi olarak gönder
    router.push(`/dashboard/new?template=${selectedComponent.id}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Default Componentler</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {defaultComponents.map((component) => (
          <div
            key={component.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedComponent?.id === component.id
                ? 'border-primary bg-primary-50'
                : 'border-gray-200 hover:border-primary-200'
            }`}
            onClick={() => setSelectedComponent(component)}
          >
            <h3 className="font-semibold mb-2">{component.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{component.description}</p>
            <div className="bg-white p-3 rounded border">
              <Preview
                html={component.html}
                css={component.css}
                javascript=""
                height="min-h-[150px]"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedComponent && (
        <div className="fixed bottom-6 right-6">
          <Button
            color="primary"
            size="lg"
            onClick={handleSelectComponent}
            className="shadow-lg"
          >
            Bu Componenti Kullan
          </Button>
        </div>
      )}
    </div>
  );
} 