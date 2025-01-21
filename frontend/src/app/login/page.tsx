'use client';

import { Button, Card, CardBody, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { auth } from '@/lib/api';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/lib/validations';
import toast from 'react-hot-toast';

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await auth.login(data);
      
      // Save token to cookie
      Cookies.set('access_token', response.access_token, { expires: 7 }); // Expires in 7 days
      
      // Wait a bit before redirect
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || 'Giriş başarısız');
      } else {
        toast.error('Beklenmeyen bir hata oluştu');
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <Card className="w-full max-w-md">
        <CardBody className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-center">Giriş</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              {...register('email')}
              type="email"
              label="E-posta"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <Input
              {...register('password')}
              type="password"
              label="Şifre"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            <Button
              type="submit"
              color="primary"
              isLoading={isSubmitting}
            >
              Giriş Yap
            </Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
} 