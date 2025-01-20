'use client';

import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        mode: 'cors'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Kayıt başarısız');
      }

      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', data.token);
      
      // Dashboard'a yönlendir
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Bir hata oluştu');
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-3 text-center">
          <h1 className="text-2xl font-bold">Kayıt Ol</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Şifre Tekrar"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <Button type="submit" color="primary">
              Kayıt Ol
            </Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
} 