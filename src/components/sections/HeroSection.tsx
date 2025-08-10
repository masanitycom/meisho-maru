'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Phone, Anchor, Fish, MapPin, Clock } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-blue-800">
      {/* 波のアニメーション背景 */}
      <div className="absolute inset-0 opacity-30">
        <svg className="absolute bottom-0 w-full h-96" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg className="absolute bottom-0 w-full h-96 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="0.2" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,80C960,96,1056,128,1152,128C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* 和風の装飾パターン */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-white rounded-full animate-spin-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white">
          {/* ロゴ */}
          <div className="mb-6 md:mb-8 animate-fade-in-down">
            <div className="inline-block relative">
              <div className="absolute -inset-8 bg-white/20 blur-3xl rounded-full hidden md:block"></div>
              
              {/* ロゴ画像 */}
              <div>
                <img 
                  src="/images/logo.png" 
                  alt="明勝丸ロゴ" 
                  className="h-24 w-24 sm:h-32 w-32 md:h-36 md:w-36 lg:h-48 lg:w-48 mx-auto object-contain drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.9)) drop-shadow(0 0 60px rgba(255,255,255,0.5)) drop-shadow(0 0 90px rgba(255,255,255,0.3))'
                  }}
                  onError={(e) => {
                    // ロゴがない場合はアンカーアイコンを表示
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden">
                  <Anchor className="h-24 w-24 sm:h-32 w-32 md:h-36 md:w-36 lg:h-48 lg:w-48 mx-auto text-white drop-shadow-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* キャッチコピー */}
          <div className="mb-6 md:mb-8 animate-fade-in px-4">
            <p className="text-xl sm:text-2xl md:text-4xl font-bold mb-3 md:mb-4 leading-relaxed font-serif">
              日本海の恵み、
              <span className="text-yellow-300">白いか</span>を追い求めて
            </p>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto font-serif">
              鳥取県琴浦町赤碕港から出航。プロの漁師が導く本格的な釣り体験。
              <br className="hidden sm:block" />
              初心者からベテランまで、忘れられない海の冒険をお約束します。
            </p>
          </div>

          {/* CTA ボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-6 text-lg font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center"
              asChild
            >
              <Link href="/reservation" className="inline-flex items-center justify-center w-full">
                <Calendar className="mr-2 h-6 w-6 flex-shrink-0" />
                <span>予約はこちら</span>
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-6 text-lg font-bold backdrop-blur-sm transform hover:scale-105 transition-all duration-300 inline-flex items-center"
              asChild
            >
              <a href={`tel:${SITE_CONFIG.contact.phone}`} className="inline-flex items-center justify-center w-full">
                <Phone className="mr-2 h-6 w-6 flex-shrink-0" />
                <span>今すぐ電話</span>
              </a>
            </Button>
          </div>

          {/* 特徴カード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto animate-fade-in">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/20">
              <Fish className="h-10 w-10 mb-3 text-yellow-300 mx-auto" />
              <h3 className="text-xl font-bold mb-2">豊富な漁獲量</h3>
              <p className="text-sm text-blue-100">日本海屈指の好漁場</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/20">
              <Anchor className="h-10 w-10 mb-3 text-yellow-300 mx-auto" />
              <h3 className="text-xl font-bold mb-2">最新設備</h3>
              <p className="text-sm text-blue-100">GPS魚探・電動リール完備</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/20">
              <MapPin className="h-10 w-10 mb-3 text-yellow-300 mx-auto" />
              <h3 className="text-xl font-bold mb-2">好アクセス</h3>
              <p className="text-sm text-blue-100">鳥取駅から車で15分</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/20">
              <Clock className="h-10 w-10 mb-3 text-yellow-300 mx-auto" />
              <h3 className="text-xl font-bold mb-2">1日2便運航</h3>
              <p className="text-sm text-blue-100">夕方便・深夜便</p>
            </div>
          </div>
        </div>
      </div>

      {/* 下部の装飾 */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600"></div>
    </section>
  );
}