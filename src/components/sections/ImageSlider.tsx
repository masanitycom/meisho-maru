'use client';

import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// スライダー画像の配列（実際の画像パスに置き換えてください）
const slideImages = [
  {
    src: '/images/slider/slide-1.jpg',
    alt: '明勝丸の外観',
  },
  {
    src: '/images/slider/slide-2.jpg',
    alt: '釣れた白イカ',
  },
  {
    src: '/images/slider/slide-3.jpg',
    alt: '船内の様子',
  },
  {
    src: '/images/slider/slide-4.jpg',
    alt: '夕日の海',
  },
  {
    src: '/images/slider/slide-5.jpg',
    alt: 'お客様の釣果',
  },
];

export function ImageSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      skipSnaps: false,
      dragFree: false,
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  useEffect(() => {
    if (emblaApi) {
      // オプション: スライド変更時のコールバック
      emblaApi.on('select', () => {
        // console.log('Current slide:', emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  return (
    <section className="relative py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* スライダー本体 */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-xl shadow-2xl" ref={emblaRef}>
            <div className="flex">
              {slideImages.map((slide, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 relative aspect-[16/9] md:aspect-[21/9]"
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  {/* オプション: 画像の上にオーバーレイテキスト */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 md:p-8">
                    <p className="text-white text-lg md:text-xl font-semibold">
                      {slide.alt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 前へボタン */}
          <button
            onClick={scrollPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg transition-all hover:scale-110 z-10"
            aria-label="前の画像"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
          </button>

          {/* 次へボタン */}
          <button
            onClick={scrollNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg transition-all hover:scale-110 z-10"
            aria-label="次の画像"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
          </button>

          {/* ドットインジケーター（オプション） */}
          <div className="flex justify-center gap-2 mt-4">
            {slideImages.map((_, index) => (
              <button
                key={index}
                className="w-2 h-2 rounded-full bg-gray-400 hover:bg-gray-600 transition-colors"
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`画像${index + 1}へ移動`}
              />
            ))}
          </div>
        </div>

        {/* プレースホルダーテキスト */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ※ 画像は /public/images/slider/ フォルダに配置してください
          </p>
          <p className="text-sm text-gray-500 mt-2">
            推奨サイズ: 1200x600px (デスクトップ) / 1200x800px (モバイル)
          </p>
        </div>
      </div>
    </section>
  );
}