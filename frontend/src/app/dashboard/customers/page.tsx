'use client'

import { CustomersList } from '@/components/customers/CustomersList';
import { Card, CardHeader } from '@nextui-org/react';

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <div>
            <h1 className="text-2xl font-bold">Müşteriler</h1>
            <p className="text-default-500">Müşteri listesi ve detaylı analiz bilgileri</p>
          </div>
        </CardHeader>
      </Card>

      <CustomersList />
    </div>
  );
} 