'use client';

import { useEffect } from 'react';

interface WebVitalsProps {
  onCLS?: (value: number) => void;
  onFID?: (value: number) => void;
  onFCP?: (value: number) => void;
  onLCP?: (value: number) => void;
  onTTFB?: (value: number) => void;
}

export function WebVitals({ onCLS, onFID, onFCP, onLCP, onTTFB }: WebVitalsProps) {
  useEffect(() => {
    // Web Vitalsの監視を開始
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => {
          if (onCLS) onCLS(metric.value);
          // 開発環境でのみコンソール出力
          if (process.env.NODE_ENV === 'development') {
            console.log('CLS:', metric.value);
          }
        });

        getFID((metric) => {
          if (onFID) onFID(metric.value);
          if (process.env.NODE_ENV === 'development') {
            console.log('FID:', metric.value);
          }
        });

        getFCP((metric) => {
          if (onFCP) onFCP(metric.value);
          if (process.env.NODE_ENV === 'development') {
            console.log('FCP:', metric.value);
          }
        });

        getLCP((metric) => {
          if (onLCP) onLCP(metric.value);
          if (process.env.NODE_ENV === 'development') {
            console.log('LCP:', metric.value);
          }
        });

        getTTFB((metric) => {
          if (onTTFB) onTTFB(metric.value);
          if (process.env.NODE_ENV === 'development') {
            console.log('TTFB:', metric.value);
          }
        });
      });
    }
  }, [onCLS, onFID, onFCP, onLCP, onTTFB]);

  return null; // このコンポーネントは何もレンダリングしない
}

// パフォーマンス最適化のヘルパー関数
export function reportWebVitals(metric: any) {
  // Google Analytics 4 にメトリクスを送信
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      custom_parameter_1: metric.value,
      custom_parameter_2: metric.id,
      custom_parameter_3: metric.name,
    });
  }
  
  // 開発環境でのログ出力
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
}