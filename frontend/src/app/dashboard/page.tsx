'use client';

import { Card, CardBody } from '@nextui-org/react';
import { useProfile } from '@/hooks/queries';

export default function Dashboard() {
  const { data: user } = useProfile();
  const apiKey = user?.apiKeys?.find(k => k.isActive)?.key || '';

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
      </div>
    </div>
  );
} 