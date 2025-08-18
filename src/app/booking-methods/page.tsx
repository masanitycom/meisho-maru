'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MessageCircle, Globe, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BookingMethodsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 pt-24 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-60 h-60 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-orange-400 rounded-full blur-3xl"></div>
      </div>
      
      {/* 波の背景 */}
      <div className="absolute bottom-0 left-0 right-0 opacity-20">
        <svg className="w-full h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#3b82f6" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">ご予約方法</h1>
            <p className="text-lg text-gray-600">
              お電話・LINE・Webからご予約いただけます
            </p>
          </div>

          {/* 予約方法カード */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {/* お電話 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">お電話</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">受付時間</p>
                  <p className="font-semibold">8:00〜20:00</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-800">おすすめ</span>
                    </div>
                    <p className="text-xs text-green-700">
                      詳細な相談・質問ができます
                    </p>
                  </div>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <a href="tel:090-4695-3087" className="flex items-center justify-center">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>090-4695-3087</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* LINE */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">LINE</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">受付時間</p>
                  <p className="font-semibold">24時間受付</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-800">便利</span>
                    </div>
                    <p className="text-xs text-green-700">
                      いつでも気軽にお問い合わせ
                    </p>
                  </div>
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <a href="https://lin.ee/HQX3Ezq" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>LINEで予約</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Web予約 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Web予約</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">受付時間</p>
                  <p className="font-semibold">24時間受付</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-4 w-4 text-purple-600 mr-1" />
                      <span className="text-sm font-medium text-purple-800">簡単</span>
                    </div>
                    <p className="text-xs text-purple-700">
                      オンラインで即座に予約完了
                    </p>
                  </div>
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link href="/reservation" className="flex items-center justify-center">
                      <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Web予約フォーム</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 注意事項 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">ご予約時の注意事項</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">予約時にお伝えください</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• ご希望の日時（第1便 または 第2便）</li>
                    <li>• 参加人数</li>
                    <li>• 竿レンタルの有無と本数</li>
                    <li>• 代表者のお名前・電話番号</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-orange-600">キャンセルについて</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• キャンセルは3日前までにご連絡ください</li>
                    <li>• 天候による欠航の場合はキャンセル料不要</li>
                    <li>• 前日夕方に運航可否をご連絡いたします</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 戻るボタン */}
          <div className="text-center">
            <Button 
              onClick={() => router.push('/')} 
              variant="outline" 
              className="px-8"
            >
              トップページに戻る
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}