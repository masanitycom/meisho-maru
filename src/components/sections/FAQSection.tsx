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
    <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-gray-100 relative overflow-hidden">
      {/* コンパスと羽根 */}
      <div className="absolute inset-0" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* 海図グリッド */}
            <pattern id="nautical-chart" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M0,40 L80,40 M40,0 L40,80" stroke="rgb(75 85 99 / 0.06)" strokeWidth="0.8" />
              <path d="M0,20 L80,20 M0,60 L80,60 M20,0 L20,80 M60,0 L60,80" stroke="rgb(75 85 99 / 0.04)" strokeWidth="0.5" />
            </pattern>
            
            {/* コンパス */}
            <g id="compass">
              <circle cx="20" cy="20" r="18" fill="none" stroke="rgb(75 85 99 / 0.12)" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="12" fill="none" stroke="rgb(75 85 99 / 0.08)" strokeWidth="1" />
              <path d="M20,2 L22,18 L20,20 L18,18 Z" fill="rgb(239 68 68 / 0.2)" />
              <path d="M20,38 L18,22 L20,20 L22,22 Z" fill="rgb(75 85 99 / 0.15)" />
              <text x="20" y="5" textAnchor="middle" fontSize="4" fill="rgb(75 85 99 / 0.3)">N</text>
            </g>
            
            {/* カモメの羽根 */}
            <g id="seagull">
              <path d="M0,5 Q5,0 10,3 Q15,0 20,5" fill="none" stroke="rgb(148 163 184 / 0.15)" strokeWidth="1.5" />
              <path d="M8,3 Q10,1 12,3" fill="none" stroke="rgb(148 163 184 / 0.12)" strokeWidth="1" />
            </g>
            
            {/* 灯台 */}
            <g id="lighthouse">
              <rect x="8" y="5" width="4" height="15" fill="rgb(239 68 68 / 0.1)" />
              <polygon points="6,5 14,5 12,0 8,0" fill="rgb(239 68 68 / 0.15)" />
              <path d="M10,2 Q15,2 20,5" fill="none" stroke="rgb(251 191 36 / 0.2)" strokeWidth="1" />
            </g>
          </defs>
          
          {/* 海図グリッド背景 */}
          <rect width="100%" height="100%" fill="url(#nautical-chart)" />
          
          {/* コンパスの配置 */}
          <use href="#compass" x="150" y="120" opacity="0.4" />
          <use href="#compass" x="800" y="300" transform="scale(1.2)" opacity="0.3" />
          <use href="#compass" x="500" y="500" transform="scale(0.8)" opacity="0.5" />
          
          {/* カモメの配置 */}
          <use href="#seagull" x="300" y="100" transform="scale(1.5)" opacity="0.4" />
          <use href="#seagull" x="320" y="110" transform="scale(1.2)" opacity="0.3" />
          <use href="#seagull" x="340" y="120" opacity="0.5" />
          <use href="#seagull" x="700" y="200" transform="scale(1.3) rotate(10)" opacity="0.3" />
          <use href="#seagull" x="900" y="400" transform="scale(1.1) rotate(-15)" opacity="0.4" />
          
          {/* 灯台の配置 */}
          <use href="#lighthouse" x="100" y="350" transform="scale(1.5)" opacity="0.25" />
          <use href="#lighthouse" x="950" y="150" transform="scale(1.2) rotate(5)" opacity="0.3" />
          
          {/* 航路 */}
          <path d="M200,200 Q400,300 700,250 Q900,200 1100,300" fill="none" stroke="rgb(59 130 246 / 0.08)" strokeWidth="2" strokeDasharray="8,4" />
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