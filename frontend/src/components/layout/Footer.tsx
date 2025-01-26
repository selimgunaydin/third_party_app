'use client';

import Link from 'next/link';
import { FiBox, FiGithub, FiTwitter, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-content1/20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <FiBox className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl">SelAI</span>
            </Link>
            <p className="text-foreground/70 text-sm">
              Yapay zeka destekli widget&apos;lar ve analitiklerle işletmenizi güçlendirin.
            </p>
            <div className="flex space-x-4">
              <Link href="https://github.com" className="text-foreground/70 hover:text-primary transition-colors">
                <FiGithub className="w-5 h-5" />
              </Link>
              <Link href="https://twitter.com" className="text-foreground/70 hover:text-primary transition-colors">
                <FiTwitter className="w-5 h-5" />
              </Link>
              <Link href="https://linkedin.com" className="text-foreground/70 hover:text-primary transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-foreground/70 hover:text-primary transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-foreground/70 hover:text-primary transition-colors">
                  Özellikler
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-foreground/70 hover:text-primary transition-colors">
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-foreground/70 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Destek</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-foreground/70 hover:text-primary transition-colors">
                  Dokümantasyon
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-foreground/70 hover:text-primary transition-colors">
                  SSS
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-foreground/70 hover:text-primary transition-colors">
                  Eğitimler
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-foreground/70">
                <FiMail className="w-5 h-5" />
                <span>info@selai.com</span>
              </li>
              <li className="flex items-center space-x-2 text-foreground/70">
                <FiPhone className="w-5 h-5" />
                <span>+90 (212) 123 45 67</span>
              </li>
              <li className="flex items-center space-x-2 text-foreground/70">
                <FiMapPin className="w-5 h-5" />
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-content1/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-foreground/70">
              © {new Date().getFullYear()} SelAI. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-foreground/70 hover:text-primary transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/terms" className="text-foreground/70 hover:text-primary transition-colors">
                Kullanım Koşulları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 