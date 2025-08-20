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
          className="fixed bottom-6 right-6 z-50 w-16 h-16 md:w-20 md:h-20 transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 touch-manipulation"
          aria-label="ページトップへ戻る"
          title="ページトップへ戻る"
        >
          <Image
            src="/images/TOP.png"
            alt="TOPへ戻る"
            width={80}
            height={80}
            className="w-full h-full object-contain drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
            priority={false}
          />
        </button>
      )}
    </>
  );
}