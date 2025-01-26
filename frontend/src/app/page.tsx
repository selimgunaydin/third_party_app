'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Analytics from '@/components/home/Analytics';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80 pt-16">
        <Hero />
        <Features />
        <Analytics />
      </main>
      <Footer />
    </>
  );
}
