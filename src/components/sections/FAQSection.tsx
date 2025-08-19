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
    <section className="py-16 md:py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-25" aria-hidden="true">
        <div className="absolute top-12 left-16 w-28 h-28 bg-rose-200 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-pink-200 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 left-1/4 w-20 h-20 bg-red-200 rounded-full blur-xl"></div>
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