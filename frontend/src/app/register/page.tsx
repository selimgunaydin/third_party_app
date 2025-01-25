'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { toast } from 'react-hot-toast';
import { useRegister } from '@/hooks/queries';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/lib/validations';
import type { RegisterData } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterData>({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      await register.mutateAsync(data);
      toast.success('Kayıt başarılı! Yönlendiriliyorsunuz...');
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Kayıt sırasında bir hata oluştu');
      } else {
        toast.error('Kayıt sırasında bir hata oluştu');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2 p-6">
          <h1 className="text-2xl font-bold">Kayıt Ol</h1>
          <p className="text-gray-500">Widget Builder&apos;a hoş geldiniz</p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <Input
                {...registerField('name')}
                label="Ad Soyad"
                placeholder="John Doe"
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                isRequired
              />
              <Input
                {...registerField('email')}
                type="email"
                label="E-posta"
                placeholder="ornek@email.com"
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                isRequired
              />
              <Input
                {...registerField('password')}
                type="password"
                label="Şifre"
                placeholder="********"
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                isRequired
              />
              <Input
                {...registerField('phone')}
                label="Telefon"
                placeholder="+90 555 555 55 55"
                isInvalid={!!errors.phone}
                errorMessage={errors.phone?.message}
              />
              <Input
                {...registerField('company')}
                label="Şirket"
                placeholder="Şirket Adı"
                isInvalid={!!errors.company}
                errorMessage={errors.company?.message}
              />
              <Input
                {...registerField('title')}
                label="Ünvan"
                placeholder="Yazılım Geliştirici"
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
              />
              <Input
                {...registerField('address')}
                label="Adres"
                placeholder="İstanbul, Türkiye"
                isInvalid={!!errors.address}
                errorMessage={errors.address?.message}
              />
              <Input
                {...registerField('bio')}
                label="Hakkında"
                placeholder="Kendinizden kısaca bahsedin..."
                isInvalid={!!errors.bio}
                errorMessage={errors.bio?.message}
              />
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={register.isPending}
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