'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20 md:h-24">
          <Link href="/" className="flex items-center group">
            {/* ロゴ画像 */}
            <div className="relative">
              <img 
                src="/images/headlogo.png" 
                alt="明勝丸ロゴ" 
                className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8)) drop-shadow(0 0 16px rgba(255,255,255,0.4))'
                }}
              />
              <Anchor className={`h-12 w-12 transition-colors hidden ${
                isScrolled ? 'text-blue-600' : 'text-white'
              } group-hover:rotate-12 transition-transform duration-300 drop-shadow-lg`} />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { href: '/#schedule', label: '運航スケジュール' },
              { href: '/#info', label: '料金・設備' },
              { href: '/#access', label: 'アクセス' },
              { href: '/#results', label: '釣果情報' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white hover:text-yellow-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={`tel:${SITE_CONFIG.contact.phone}`}
              className={`inline-flex items-center space-x-2 font-medium transition-colors ${
                isScrolled 
                  ? 'text-blue-600 hover:text-blue-700' 
                  : 'text-white hover:text-yellow-300'
              }`}
            >
              <Phone className="h-5 w-5 flex-shrink-0" />
              <span className="whitespace-nowrap">{SITE_CONFIG.contact.phone}</span>
            </a>
            <Button 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center"
              asChild
            >
              <Link href="/reservation" className="inline-flex items-center">
                <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>予約する</span>
              </Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-xl">
            <nav className="flex flex-col space-y-4 px-4">
              {[
                { href: '/#schedule', label: '運航スケジュール' },
                { href: '/#info', label: '料金・設備' },
                { href: '/#access', label: 'アクセス' },
                { href: '/#results', label: '釣果情報' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <a
                  href={`tel:${SITE_CONFIG.contact.phone}`}
                  className="inline-flex items-center space-x-2 text-blue-600 font-medium mb-4"
                >
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{SITE_CONFIG.contact.phone}</span>
                </a>
                <Button 
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white inline-flex items-center justify-center"
                  asChild
                >
                  <Link href="/reservation" className="inline-flex items-center justify-center w-full">
                    <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>予約する</span>
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}