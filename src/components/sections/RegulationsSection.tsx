'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Clock, Shield } from 'lucide-react';

export function RegulationsSection() {
  return (
    <section id="regulations" className="py-16 md:py-24 bg-emerald-50 relative overflow-hidden">
      {/* 和紙風幾何学パターン */}
      <div className="absolute inset-0" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagon-pattern" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
              <polygon points="60,8 90,26 90,62 60,80 30,62 30,26" 
                       fill="none" stroke="rgb(16 185 129 / 0.08)" strokeWidth="1" />
              <polygon points="60,20 80,30 80,50 60,60 40,50 40,30" 
                       fill="rgb(16 185 129 / 0.05)" stroke="rgb(16 185 129 / 0.1)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="emerald-fade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(16 185 129 / 0.1)" />
              <stop offset="50%" stopColor="rgb(16 185 129 / 0.05)" />
              <stop offset="100%" stopColor="rgb(16 185 129 / 0.02)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
          <rect x="0" y="0" width="100%" height="100%" fill="url(#emerald-fade)" />
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">遊漁船業務規定について</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            明勝丸は適切な許認可を取得し、安全基準を満たした正規の遊漁船です。
            <br />
            お客様に安心してご利用いただけるよう、各種規定を公開しております。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* 業務規程 */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">業務規程</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600 text-sm">
                遊漁船業の適正な運営のための規程です。
                <br />
                料金、安全対策、運航基準等を定めています。
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-center text-blue-700 text-sm mb-2">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="font-medium">安全運航の基準</span>
                </div>
                <p className="text-xs text-blue-600">
                  お客様の安全を最優先に運航しています
                </p>
              </div>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link 
                  href="/pdf-viewer?type=regulations"
                  className="flex items-center justify-center"
                  title="明勝丸 遊漁船業務規程 - 鳥取県琴浦町の白いか釣り専門船の安全運航基準・料金規定"
                  aria-label="明勝丸の遊漁船業務規程を表示"
                >
                  <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>業務規程を見る</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* 遊漁船業登録票 */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">遊漁船業者登録票</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600 text-sm">
                鳥取県知事による正式な遊漁船業者の登録票です。
                <br />
                適法に営業していることを証明する公式書類です。
              </p>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-center text-green-700 text-sm mb-2">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="font-medium">正式登録済み</span>
                </div>
                <p className="text-xs text-green-600">
                  鳥取県知事認可の遊漁船業者です
                </p>
              </div>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link 
                  href="/pdf-viewer?type=registration"
                  className="flex items-center justify-center"
                  title="明勝丸 遊漁船業者登録票 - 鳥取県知事認可 正式登録番号記載 白いか釣り専門船"
                  aria-label="明勝丸の遊漁船業者登録票を表示（鳥取県知事認可）"
                >
                  <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>登録票を見る</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 補足情報 */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">安全への取り組み</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>船舶検査済証の取得と定期的な安全点検の実施</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>小型船舶操縦士免許を保有した船長による運航</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>救命胴衣の完備と着用の徹底</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>海上保安庁との連携による安全管理</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>損害賠償責任保険への加入</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}