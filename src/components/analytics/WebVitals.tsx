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
    // ブラウザのPerformance APIを使用してパフォーマンスを監視
    if (typeof window !== 'undefined' && 'performance' in window) {
      // LCP (Largest Contentful Paint) の監視
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry && onLCP) {
              onLCP(lastEntry.startTime);
              if (process.env.NODE_ENV === 'development') {
                console.log('LCP:', lastEntry.startTime);
              }
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // FCP (First Contentful Paint) の監視
          const fcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
              if (entry.name === 'first-contentful-paint' && onFCP) {
                onFCP(entry.startTime);
                if (process.env.NODE_ENV === 'development') {
                  console.log('FCP:', entry.startTime);
                }
              }
            });
          });
          fcpObserver.observe({ entryTypes: ['paint'] });

          // CLS (Cumulative Layout Shift) の監視
          const clsObserver = new PerformanceObserver((entryList) => {
            let clsValue = 0;
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
              const layoutShiftEntry = entry as PerformanceEntry & {
                hadRecentInput?: boolean;
                value?: number;
              };
              if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
                clsValue += layoutShiftEntry.value;
              }
            });
            if (clsValue > 0 && onCLS) {
              onCLS(clsValue);
              if (process.env.NODE_ENV === 'development') {
                console.log('CLS:', clsValue);
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

        } catch (error) {
          console.warn('Performance monitoring not supported:', error);
        }
      }

      // Navigation Timing APIでTTFBを測定
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation && onTTFB) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        onTTFB(ttfb);
        if (process.env.NODE_ENV === 'development') {
          console.log('TTFB:', ttfb);
        }
      }
    }
  }, [onCLS, onFID, onFCP, onLCP, onTTFB]);

  return null; // このコンポーネントは何もレンダリングしない
}

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
  navigationType?: string;
}

interface WindowWithGtag extends Window {
  gtag?: (
    command: string,
    action: string,
    parameters: Record<string, unknown>
  ) => void;
}

// パフォーマンス最適化のヘルパー関数
export function reportWebVitals(metric: WebVitalsMetric) {
  // Google Analytics 4 にメトリクスを送信
  if (typeof window !== 'undefined') {
    const windowWithGtag = window as WindowWithGtag;
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('event', metric.name, {
        custom_parameter_1: metric.value,
        custom_parameter_2: metric.id,
        custom_parameter_3: metric.name,
      });
    }
  }
  
  // 開発環境でのログ出力
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
}