'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// スライダー画像の配列（実際に存在する画像のみ）
const slideImages = [
  {
    src: '/images/slider/slide-1.jpg',
    alt: '明勝丸の船体外観 - GPS魚群探知機完備の白いか釣り専門船（鳥取県琴浦町赤碕港）',
  },
  {
    src: '/images/slider/slide-2.jpg',
    alt: '鳥取県日本海で釣れた新鮮な白いか（シロイカ・スルメイカ）- 明勝丸での釣果',
  },
  {
    src: '/images/slider/slide-4.jpg',
    alt: '日本海の夕日と白いか釣り船明勝丸 - 鳥取県琴浦町の夜釣り出航風景',
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
    <section className="relative bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full">
        {/* スライダー本体 */}
        <div className="relative w-full">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slideImages.map((slide, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 relative aspect-[16/9] md:aspect-[21/9]"
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    quality={index === 0 ? 95 : 85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 前へボタン */}
          <button
            onClick={scrollPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg transition-all hover:scale-110 z-10"
            aria-label="前の画像スライドを表示"
            type="button"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
          </button>

          {/* 次へボタン */}
          <button
            onClick={scrollNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg transition-all hover:scale-110 z-10"
            aria-label="次の画像スライドを表示"
            type="button"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
          </button>

          {/* ドットインジケーター（オプション） */}
          <div className="flex justify-center gap-2 mt-6 container mx-auto px-4">
            {slideImages.map((_, index) => (
              <button
                key={index}
                className="w-3 h-3 rounded-full bg-gray-400 hover:bg-gray-600 transition-colors"
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`画像${index + 1}へ移動`}
                type="button"
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}