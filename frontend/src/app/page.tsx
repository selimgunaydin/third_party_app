'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl font-bold mb-8">
          Widget Builder Platform
        </h1>
        <p className="text-xl mb-8">
          Kendi özel widget&apos;larınızı oluşturun ve web sitenize ekleyin
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            as={Link}
            href="/login"
            color="primary"
            variant="solid"
            size="lg"
          >
            Giriş Yap
          </Button>
          <Button
            as={Link}
            href="/register"
            color="secondary"
            variant="solid"
            size="lg"
          >
            Kayıt Ol
          </Button>
        </div>
      </div>
    </main>
  );
}
