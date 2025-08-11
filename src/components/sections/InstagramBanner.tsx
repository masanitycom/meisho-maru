'use client';

import { Instagram, ExternalLink, Fish } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function InstagramBanner() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-center">
            {/* Instagramアイコン */}
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-full p-4 shadow-xl">
                <Instagram className="h-12 w-12 md:h-16 md:w-16 text-pink-600" />
              </div>
            </div>

            {/* タイトル */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              最新の釣果はInstagramで！
            </h2>

            {/* 説明文 */}
            <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
              明勝丸での釣果情報を毎日更新中！<br className="hidden md:block" />
              大物が釣れた瞬間や、お客様の笑顔をお届けしています。
            </p>

            {/* 特徴 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <Fish className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white font-semibold">毎日の釣果</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-white text-2xl font-bold mb-2">📸</div>
                <p className="text-white font-semibold">お客様の記念写真</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-white text-2xl font-bold mb-2">🌊</div>
                <p className="text-white font-semibold">海況情報</p>
              </div>
            </div>

            {/* CTAボタン */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-100 text-pink-600 font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                asChild
              >
                <a
                  href="https://www.instagram.com/meisho_maru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Instagram className="mr-2 h-5 w-5" />
                  Instagramをフォロー
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>

              {/* フォロワー数（オプション） */}
              <div className="text-white">
                <span className="text-sm">フォロワー</span>
                <span className="text-2xl font-bold ml-2">1.2K+</span>
              </div>
            </div>

            {/* ハッシュタグ */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {['#明勝丸', '#白イカ釣り', '#鳥取釣り船', '#赤碕港', '#釣果情報'].map((tag) => (
                <span
                  key={tag}
                  className="bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* アカウント名 */}
            <p className="mt-6 text-white/80 text-sm">
              @meisho_maru
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}