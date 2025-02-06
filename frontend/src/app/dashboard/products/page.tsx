'use client';

import { useProducts, useImportProducts } from '@/hooks/queries/useProducts';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table';
import { useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function ProductsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: products, isLoading } = useProducts();
  const importMutation = useImportProducts();

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const xmlContent = e.target?.result as string;
        await importMutation.mutateAsync(xmlContent);
        toast.success('Ürünler başarıyla içe aktarıldı');
      } catch (error) {
        toast.error('Ürünleri içe aktarırken bir hata oluştu');
      }
    };
    reader.readAsText(file);
  }, [importMutation]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Ürünler</h1>
          <div>
            <input
              type="file"
              accept=".xml"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              color="primary"
              onClick={handleImportClick}
            >
              XML İçe Aktar
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Table aria-label="Ürün listesi">
            <TableHeader>
              <TableColumn>Ürün Adı</TableColumn>
              <TableColumn>SKU</TableColumn>
              <TableColumn>Fiyat</TableColumn>
              <TableColumn>Stok</TableColumn>
              <TableColumn>Kategori</TableColumn>
              <TableColumn>Görsel</TableColumn>
              <TableColumn>Link</TableColumn>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stock || '-'}</TableCell>
                  <TableCell>{product.category || '-'}</TableCell>
                  <TableCell>{product.image || '-'}</TableCell>
                  <TableCell>{product.link || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
} 