'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { auth } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());

      await auth.register(data);
      toast.success('Kayıt başarılı! Yönlendiriliyorsunuz...');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Kayıt sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2 p-6">
          <h1 className="text-2xl font-bold">Kayıt Ol</h1>
          <p className="text-gray-500">Widget Builder'a hoş geldiniz</p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <Input
                name="name"
                label="Ad Soyad"
                placeholder="John Doe"
                isRequired
              />
              <Input
                name="email"
                type="email"
                label="E-posta"
                placeholder="ornek@email.com"
                isRequired
              />
              <Input
                name="password"
                type="password"
                label="Şifre"
                placeholder="********"
                isRequired
              />
              <Input
                name="phone"
                label="Telefon"
                placeholder="+90 555 555 55 55"
              />
              <Input
                name="company"
                label="Şirket"
                placeholder="Şirket Adı"
              />
              <Input
                name="title"
                label="Ünvan"
                placeholder="Yazılım Geliştirici"
              />
              <Input
                name="address"
                label="Adres"
                placeholder="İstanbul, Türkiye"
              />
              <Input
                name="bio"
                label="Hakkında"
                placeholder="Kendinizden kısaca bahsedin..."
              />
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
            >
              Kayıt Ol
            </Button>

            <Divider className="my-4" />

            <p className="text-center text-sm text-gray-500">
              Zaten hesabınız var mı?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Giriş Yap
              </Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
} 