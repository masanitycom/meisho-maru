'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Clock, Shield } from 'lucide-react';

export function RegulationsSection() {
  return (
    <section id="regulations" className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 to-teal-50 relative overflow-hidden">
      {/* 網目パターンと魚籠 */}
      <div className="absolute inset-0" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* 漁網パターン */}
            <pattern id="fishing-net" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0,30 L30,0 L60,30 L30,60 Z" fill="none" stroke="rgb(16 185 129 / 0.08)" strokeWidth="1" />
              <circle cx="30" cy="30" r="2" fill="rgb(16 185 129 / 0.12)" />
              <circle cx="0" cy="30" r="1" fill="rgb(16 185 129 / 0.1)" />
              <circle cx="60" cy="30" r="1" fill="rgb(16 185 129 / 0.1)" />
              <circle cx="30" cy="0" r="1" fill="rgb(16 185 129 / 0.1)" />
              <circle cx="30" cy="60" r="1" fill="rgb(16 185 129 / 0.1)" />
            </pattern>
            
            {/* 魚籠のシルエット */}
            <g id="fish-trap">
              <rect x="0" y="5" width="25" height="15" rx="3" fill="none" stroke="rgb(16 185 129 / 0.15)" strokeWidth="1.5" />
              <path d="M5,5 L5,20 M10,5 L10,20 M15,5 L15,20 M20,5 L20,20" stroke="rgb(16 185 129 / 0.1)" strokeWidth="0.8" />
              <circle cx="2" cy="12" r="1" fill="rgb(16 185 129 / 0.2)" />
            </g>
            
            {/* アンカー */}
            <g id="anchor">
              <path d="M10,0 L10,18 M5,15 Q10,20 15,15 M3,8 L17,8" stroke="rgb(75 85 99 / 0.12)" strokeWidth="2" fill="none" />
              <circle cx="10" cy="3" r="2" fill="none" stroke="rgb(75 85 99 / 0.12)" strokeWidth="1.5" />
            </g>
          </defs>
          
          {/* 網目背景 */}
          <rect width="100%" height="100%" fill="url(#fishing-net)" />
          
          {/* 魚籠の配置 */}
          <use href="#fish-trap" x="200" y="150" transform="rotate(15)" opacity="0.4" />
          <use href="#fish-trap" x="800" y="300" transform="rotate(-10) scale(1.2)" opacity="0.3" />
          <use href="#fish-trap" x="500" y="500" transform="rotate(25) scale(0.8)" opacity="0.5" />
          
          {/* アンカーの配置 */}
          <use href="#anchor" x="150" y="400" transform="rotate(20)" opacity="0.25" />
          <use href="#anchor" x="900" y="200" transform="rotate(-15) scale(1.1)" opacity="0.2" />
          
          {/* 網の線 */}
          <path d="M220,150 Q300,200 500,500" fill="none" stroke="rgb(16 185 129 / 0.06)" strokeWidth="1.5" strokeDasharray="5,5" />
          <path d="M815,300 Q700,350 220,180" fill="none" stroke="rgb(16 185 129 / 0.05)" strokeWidth="1" strokeDasharray="3,3" />
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
          <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">業務規程</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 px-4 pb-6">
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
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 h-12 sm:h-11 text-base sm:text-sm font-semibold touch-manipulation">
                <Link 
                  href="/pdf-viewer?type=regulations"
                  className="flex items-center justify-center gap-2 px-4 py-3 w-full h-full"
                  title="明勝丸 遊漁船業務規程 - 鳥取県琴浦町の白いか釣り専門船の安全運航基準・料金規定"
                  aria-label="明勝丸の遊漁船業務規程を表示"
                >
                  <Download className="h-5 w-5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>業務規程を見る</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* 遊漁船業登録票 */}
          <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">遊漁船業者登録票</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 px-4 pb-6">
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
              <Button asChild className="w-full bg-green-600 hover:bg-green-700 h-12 sm:h-11 text-base sm:text-sm font-semibold touch-manipulation">
                <Link 
                  href="/pdf-viewer?type=registration"
                  className="flex items-center justify-center gap-2 px-4 py-3 w-full h-full"
                  title="明勝丸 遊漁船業者登録票 - 鳥取県知事認可 正式登録番号記載 白いか釣り専門船"
                  aria-label="明勝丸の遊漁船業者登録票を表示（鳥取県知事認可）"
                >
                  <Download className="h-5 w-5 sm:h-4 sm:w-4 flex-shrink-0" />
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