'use client';

import { Instagram, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function InstagramBanner() {
  return (
    <section className="py-8 md:py-10 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 md:p-8">
            {/* 左側：テキスト */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                最新の釣果はInstagramで！
              </h3>
              <p className="text-white/90">
                毎日の釣果情報を更新予定
              </p>
            </div>

            {/* 右側：ボタン */}
            <Button
              size="lg"
              className="bg-white hover:bg-gray-100 text-pink-600 font-bold px-6 py-3 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              asChild
            >
              <a
                href="https://www.instagram.com/meisho_maru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Instagram className="mr-2 h-5 w-5" />
                Instagramで見る
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}