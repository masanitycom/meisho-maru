'use client';

import { MessageCircle, Phone, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function LineReservation() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ご予約方法
            </h2>
            <p className="text-lg text-gray-600">
              お電話・LINE・Webからご予約いただけます
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* LINE予約 */}
            <Card className="border-2 border-green-500 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-green-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">LINE予約</h3>
                <p className="text-gray-600 mb-4">
                  24時間受付可能<br />
                  お気軽にお問い合わせください
                </p>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  asChild
                >
                  <a
                    href="https://lin.ee/HQX3Ezq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    LINE友だち追加
                  </a>
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  @707ejlid
                </p>
              </CardContent>
            </Card>

            {/* 電話予約 */}
            <Card className="border-2 border-blue-500 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">電話予約</h3>
                <p className="text-gray-600 mb-4">
                  受付時間 9:00〜17:00<br />
                  直接お話しできます
                </p>
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  asChild
                >
                  <a
                    href="tel:090-4695-3087"
                    className="inline-flex items-center justify-center"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    090-4695-3087
                  </a>
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  クリックで発信
                </p>
              </CardContent>
            </Card>

            {/* Web予約 */}
            <Card className="border-2 border-red-500 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-red-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Web予約</h3>
                <p className="text-gray-600 mb-4">
                  24時間受付可能<br />
                  空席確認も即座に可能
                </p>
                <Button 
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  asChild
                >
                  <a
                    href="/reservation"
                    className="inline-flex items-center justify-center"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Web予約フォーム
                  </a>
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  空席確認・即予約
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 予約時の注意事項 */}
          <div className="mt-8 bg-orange-50 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-orange-600" />
              ご予約時のお願い
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                ご予約は3日前までにお願いいたします
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                天候により欠航の場合は前日夕方にご連絡いたします
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                キャンセルは3日前までにご連絡ください
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}