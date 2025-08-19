'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, ArrowRight, MessageCircle, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';

const popularQuestions = [
  {
    question: '初心者でも釣れますか？',
    answer: '初心者の方でも大丈夫！船長が丁寧にサポートします。',
  },
  {
    question: '料金はいくらですか？',
    answer: '乗船料11,000円/人、竿レンタル2,000円/本です。',
  },
  {
    question: '予約方法を教えてください',
    answer: '電話・LINE・Webフォームから予約可能です。',
  },
];

export function FAQSection() {
  return (
    <section className="py-16 md:py-20 bg-gray-50 relative overflow-hidden">
      {/* 線形パターン */}
      <div className="absolute inset-0" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="line-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0,60 L60,0" stroke="rgb(239 68 68 / 0.08)" strokeWidth="1" fill="none" />
              <path d="M0,0 L60,60" stroke="rgb(239 68 68 / 0.06)" strokeWidth="0.8" fill="none" />
            </pattern>
            <filter id="soft-blur">
              <feGaussianBlur stdDeviation="1" />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#line-pattern)" />
          <g filter="url(#soft-blur)">
            <circle cx="200" cy="200" r="60" fill="none" stroke="rgb(239 68 68 / 0.12)" strokeWidth="2" />
            <circle cx="800" cy="300" r="80" fill="none" stroke="rgb(239 68 68 / 0.1)" strokeWidth="1.5" />
            <circle cx="400" cy="750" r="100" fill="none" stroke="rgb(239 68 68 / 0.08)" strokeWidth="1" />
          </g>
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">よくあるご質問</h2>
          <p className="text-lg text-gray-600">
            お客様からよくいただくご質問をまとめました
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 人気の質問 */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {popularQuestions.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-sm">{item.question}</h3>
                  </div>
                  <p className="text-sm text-gray-600 pl-8">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTAボタン */}
          <div className="text-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/faq" className="flex items-center">
                <HelpCircle className="mr-2 h-5 w-5" />
                すべての質問を見る
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* お問い合わせ情報 */}
          <div className="mt-10 bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <p className="text-gray-700 font-semibold">
                その他のご質問はお気軽にお問い合わせください
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="justify-center">
                <a href="tel:090-4695-3087" className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  電話で問い合わせ
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-center">
                <a href="https://lin.ee/HQX3Ezq" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  LINEで問い合わせ
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-center">
                <Link href="/booking-methods" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  予約方法を見る
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}