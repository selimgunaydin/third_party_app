'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBox, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

const navItems = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Özellikler', href: '#features' },
  { name: 'Analitikler', href: '#analytics' },
  { name: 'Dokümantasyon', href: '/docs' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-content1/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <FiBox className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl">SelAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button
              as={Link}
              href="/login"
              color="primary"
              variant="flat"
              size="sm"
            >
              Giriş Yap
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground/70 hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-content1/20"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground/70 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                as={Link}
                href="/login"
                color="primary"
                variant="flat"
                size="sm"
                className="w-full"
              >
                Giriş Yap
              </Button>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header; 