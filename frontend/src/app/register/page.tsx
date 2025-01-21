'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Input } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { auth } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Production ortamında register sayfasına erişimi engelle
    if (process.env.NODE_ENV === 'production') {
      router.replace('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await auth.register({
        name,
        email,
        password
      });

      toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
      router.push('/login');
    } catch (err) {
      console.error(err);
      toast.error('Kayıt sırasında bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  // Production ortamında içerik gösterme
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardBody className="space-y-4">
          <h1 className="text-2xl font-bold text-center mb-6">Kayıt Ol</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Ad Soyad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="E-posta"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Kayıt Ol
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
} 