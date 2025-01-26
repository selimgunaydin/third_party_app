'use client';

import { useMostViewedProducts, useMostAddedProducts, useOrderStatistics, useTimeBasedAnalytics } from '@/hooks/queries/useAnalytics';
import React from 'react';
import { Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardBody } from "@nextui-org/react";
import { formatDate, formatPrice } from '@/lib/utils';

export default function AnalyticsReport() {
  const { data: mostViewedProducts } = useMostViewedProducts();
  const { data: mostAddedProducts } = useMostAddedProducts();
  const { data: orderStatistics } = useOrderStatistics();
  const { data: timeBasedAnalytics } = useTimeBasedAnalytics();

  return (
    <div className="w-full space-y-4">
      <h1 className="text-2xl font-bold mb-6">Analytics Reports</h1>
      
      <Tabs aria-label="Analitik Sekmeler">
        <Tab key="most-viewed" title="En Çok Görüntülenen Ürünler">
          <Card>
            <CardBody>
              <Table aria-label="En çok görüntülenen ürünler">
                <TableHeader>
                  <TableColumn>ÜRÜN ADI</TableColumn>
                  <TableColumn>GÖRÜNTÜLENME</TableColumn>
                  <TableColumn>FİYAT</TableColumn>
                  <TableColumn>SON GÖRÜNTÜLENME</TableColumn>
                </TableHeader>
                <TableBody>
                  {mostViewedProducts?.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.viewCount}</TableCell>
                      <TableCell>{formatPrice(product.productPrice)}</TableCell>
                      <TableCell>{formatDate(product.lastViewed)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="most-added" title="En Çok Sepete Eklenenler">
          <Card>
            <CardBody>
              <Table aria-label="En çok sepete eklenen ürünler">
                <TableHeader>
                  <TableColumn>ÜRÜN ADI</TableColumn>
                  <TableColumn>SEPETE EKLENME</TableColumn>
                  <TableColumn>FİYAT</TableColumn>
                  <TableColumn>SON EKLENME</TableColumn>
                </TableHeader>
                <TableBody>
                  {mostAddedProducts?.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.addToCartCount}</TableCell>
                      <TableCell>{formatPrice(product.productPrice)}</TableCell>
                      <TableCell>{formatDate(product.lastAdded)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="order-stats" title="Sipariş İstatistikleri">
          <Card>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-primary-50">
                  <p className="text-sm text-gray-600">Toplam Sipariş</p>
                  <p className="text-2xl font-bold">{orderStatistics?.totalOrders}</p>
                </div>
                <div className="p-4 rounded-lg bg-primary-50">
                  <p className="text-sm text-gray-600">Toplam Tutar</p>
                  <p className="text-2xl font-bold">{formatPrice(orderStatistics?.totalAmount)}</p>
                </div>
                <div className="p-4 rounded-lg bg-primary-50">
                  <p className="text-sm text-gray-600">Ortalama Sipariş Tutarı</p>
                  <p className="text-2xl font-bold">{formatPrice(orderStatistics?.averageOrderAmount)}</p>
                </div>
                <div className="p-4 rounded-lg bg-primary-50">
                  <p className="text-sm text-gray-600">Minimum Sipariş</p>
                  <p className="text-2xl font-bold">{formatPrice(orderStatistics?.minOrderAmount)}</p>
                </div>
                <div className="p-4 rounded-lg bg-primary-50">
                  <p className="text-sm text-gray-600">Maksimum Sipariş</p>
                  <p className="text-2xl font-bold">{formatPrice(orderStatistics?.maxOrderAmount)}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="time-based" title="Zaman Bazlı Analizler">
          <Card>
            <CardBody>
              <Table aria-label="Zaman bazlı etkinlikler">
                <TableHeader>
                  <TableColumn>ETKİNLİK</TableColumn>
                  <TableColumn>SAYI</TableColumn>
                </TableHeader>
                <TableBody>
                  {timeBasedAnalytics?.[0]?.events.map((event) => (
                    <TableRow key={event.eventName}>
                      <TableCell>{event.eventName}</TableCell>
                      <TableCell>{event.count}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-bold">TOPLAM ETKİNLİK</TableCell>
                    <TableCell className="font-bold">{timeBasedAnalytics?.[0]?.totalEvents}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
