'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl font-bold text-primary">
              <span className="text-accent">明</span>勝丸
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#schedule" className="text-gray-700 hover:text-primary transition-colors">
              運航スケジュール
            </Link>
            <Link href="/#info" className="text-gray-700 hover:text-primary transition-colors">
              料金・設備
            </Link>
            <Link href="/#access" className="text-gray-700 hover:text-primary transition-colors">
              アクセス
            </Link>
            <Link href="/#results" className="text-gray-700 hover:text-primary transition-colors">
              釣果情報
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`tel:${SITE_CONFIG.contact.phone}`}
              className="flex items-center space-x-2 text-primary"
            >
              <Phone className="h-5 w-5" />
              <span className="font-medium">{SITE_CONFIG.contact.phone}</span>
            </a>
            <Button asChild>
              <Link href="/reservation">
                <Calendar className="mr-2 h-4 w-4" />
                予約する
              </Link>
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/#schedule"
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                運航スケジュール
              </Link>
              <Link
                href="/#info"
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                料金・設備
              </Link>
              <Link
                href="/#access"
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                アクセス
              </Link>
              <Link
                href="/#results"
                className="text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                釣果情報
              </Link>
              <div className="pt-4 border-t">
                <a
                  href={`tel:${SITE_CONFIG.contact.phone}`}
                  className="flex items-center space-x-2 text-primary mb-4"
                >
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">{SITE_CONFIG.contact.phone}</span>
                </a>
                <Button asChild className="w-full">
                  <Link href="/reservation">
                    <Calendar className="mr-2 h-4 w-4" />
                    予約する
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