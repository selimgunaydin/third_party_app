'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function Home() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl font-bold mb-8">
          Widget Builder Platform
        </h1>
        <p className="text-xl mb-8">
          Create and add your custom widgets to your website
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            as={Link}
            href="/login"
            color="primary"
            variant="solid"
            size="lg"
          >
            Login
          </Button>
          {isDevelopment && (
            <Button
              as={Link}
              href="/register"
              color="secondary"
              variant="solid"
              size="lg"
            >
              Register
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
