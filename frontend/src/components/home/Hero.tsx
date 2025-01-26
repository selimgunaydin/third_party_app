'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="relative min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-4xl mx-auto"
      >
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-6">
          SelAI Platform
        </h1>
        <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
          Sitenizi özelleştirilebilir widget&apos;larla ve analitiklerle güçlendirin.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button
            as={Link}
            href="/login"
            color="primary"
            variant="shadow"
            size="lg"
            className="font-semibold"
          >
            Hemen Başla
          </Button>
          {isDevelopment && (
            <Button
              as={Link}
              href="/register"
              color="secondary"
              variant="bordered"
              size="lg"
              className="font-semibold"
            >
              Kayıt Ol
            </Button>
          )}
        </div>
      </motion.div>

      {/* Floating Widgets Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-16 h-16 bg-primary/20 rounded-lg backdrop-blur-sm"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/4 w-20 h-20 bg-secondary/20 rounded-lg backdrop-blur-sm"
        />
      </div>
    </div>
  );
};

export default Hero; 