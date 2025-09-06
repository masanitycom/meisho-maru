'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Phone, Anchor, Fish, MapPin, Clock } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-blue-800 pt-24 md:pt-20">
      {/* 波のアニメーション背景 */}
      <div className="absolute inset-0 opacity-30" aria-hidden="true">
        <svg className="absolute bottom-0 w-full h-96" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg className="absolute bottom-0 w-full h-96 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="0.2" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,80C960,96,1056,128,1152,128C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* 和風の装飾パターン */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10" aria-hidden="true">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-white rounded-full animate-spin-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white">
          {/* ロゴ - スマホでは非表示 */}
          <div className="hidden md:block mb-6 md:mb-8 animate-fade-in-down">
            <div className="inline-block relative">
              <div className="absolute -inset-8 bg-white/20 blur-3xl rounded-full hidden md:block"></div>
              
              {/* ロゴ画像 */}
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="明勝丸公式ロゴ - 鳥取県琴浦町赤碕港の白いか釣り専門遊漁船・夜釣り・イカメタル体験"
                  width={448}
                  height={448}
                  priority
                  quality={95}
                  className="md:h-80 md:w-80 lg:h-96 lg:w-96 xl:h-[28rem] xl:w-[28rem] mx-auto object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.9)) drop-shadow(0 0 60px rgba(255,255,255,0.5)) drop-shadow(0 0 90px rgba(255,255,255,0.3))'
                  }}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
                <div className="hidden">
                  <Anchor className="md:h-80 md:w-80 lg:h-96 lg:w-96 xl:h-[28rem] xl:w-[28rem] mx-auto text-white drop-shadow-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* キャッチコピー */}
          <div className="mb-6 md:mb-8 animate-fade-in px-4">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-3 md:mb-4 leading-relaxed font-serif">
              鳥取県琴浦町の白いか釣り専門船 明勝丸
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4 leading-relaxed font-serif">
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
            <Link 
              href="/booking-methods" 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-6 text-lg font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center rounded-md h-14 w-full sm:w-auto"
              aria-label="明勝丸の予約ページへ移動"
            >
              <Calendar className="mr-2 h-6 w-6 flex-shrink-0" />
              <span>予約はこちら</span>
            </Link>
            
            <a 
              href={`tel:${SITE_CONFIG.contact.phone}`} 
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-2 border-orange-400 px-8 py-6 text-lg font-bold transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center shadow-2xl rounded-md h-14 w-full sm:w-auto"
              aria-label="明勝丸に電話で予約・問い合わせ"
            >
              <Phone className="mr-2 h-6 w-6 flex-shrink-0" />
              <span>今すぐ電話</span>
            </a>
          </div>

          {/* 特徴カード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto animate-fade-in mb-12 md:mb-16" role="region" aria-label="明勝丸の主な特徴">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/20" role="article" aria-labelledby="feature-1">
              <Fish className="h-10 w-10 mb-3 text-yellow-300 mx-auto" aria-hidden="true" />
              <h3 id="feature-1" className="text-xl font-bold mb-2">豊富な漁獲量</h3>
              <p className="text-sm text-blue-100">日本海屈指の好漁場</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/20" role="article" aria-labelledby="feature-2">
              <Anchor className="h-10 w-10 mb-3 text-yellow-300 mx-auto" aria-hidden="true" />
              <h3 id="feature-2" className="text-xl font-bold mb-2">最新設備</h3>
              <p className="text-sm text-blue-100">GPS魚群探知機完備</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/20" role="article" aria-labelledby="feature-3">
              <MapPin className="h-10 w-10 mb-3 text-yellow-300 mx-auto" aria-hidden="true" />
              <h3 id="feature-3" className="text-xl font-bold mb-2">赤碕港出港</h3>
              <p className="text-sm text-blue-100">琴浦町から日本海へ</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/20" role="article" aria-labelledby="feature-4">
              <Clock className="h-10 w-10 mb-3 text-yellow-300 mx-auto" aria-hidden="true" />
              <h3 id="feature-4" className="text-xl font-bold mb-2">1日2便運航</h3>
              <p className="text-sm text-blue-100">夕方便・深夜便</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO用の隠しテキスト */}
      <div className="sr-only">
        <h2>白いか遊漁船明勝丸の特徴</h2>
        <p>白いか遊漁専門。経験豊富な船長が案内する白いか遊漁船。鳥取県琴浦町赤碕港から白いか遊漁に出発。</p>
        <p>白いか遊漁、白イカ遊漁、シロイカ遊漁、スルメイカ遊漁に対応。</p>
        <p>日本海で白いか遊漁。鳥取で白いか遊漁。琴浦町で白いか遊漁。赤碕で白いか遊漁。</p>
        <p>白いか遊漁船の運航時間：1便17:30〜23:30、2便24:00〜5:30</p>
        <p>白いか遊漁料金：11,000円/人、竿レンタル2,000円</p>
      </div>

      {/* 下部の装飾 */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600"></div>
    </section>
  );
}