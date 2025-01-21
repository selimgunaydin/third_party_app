'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Input } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { auth } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/lib/validations';
import { AxiosError } from 'axios';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    // Production ortamında register sayfasına erişimi engelle
    if (process.env.NODE_ENV === 'production') {
      router.replace('/login');
    }
  }, [router]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await auth.register(data);
      toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
      router.push('/login');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Kayıt işlemi başarısız');
      } else {
        console.error(err);
        toast.error('Kayıt sırasında bir hata oluştu!');
      }
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('name')}
              label="Ad Soyad"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
            <Input
              {...register('email')}
              label="E-posta"
              type="email"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <Input
              {...register('password')}
              label="Şifre"
              type="password"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isSubmitting}
            >
              Kayıt Ol
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
} 