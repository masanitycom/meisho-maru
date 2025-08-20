'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="hidden md:block fixed bottom-6 right-6 z-50 w-32 h-32 lg:w-40 lg:h-40 transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="ページトップへ戻る"
          title="ページトップへ戻る"
        >
          <Image
            src="/images/TOP.png"
            alt="TOPへ戻る"
            width={160}
            height={160}
            className="w-full h-full object-contain drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
            priority={false}
          />
        </button>
      )}
    </>
  );
}