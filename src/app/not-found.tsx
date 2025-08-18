import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, Calendar, Phone, Anchor, Fish } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 ヘッダー */}
          <div className="mb-8">
            <div className="inline-block relative mb-6">
              <Image
                src="/images/logo.png"
                alt="明勝丸ロゴ"
                width={200}
                height={200}
                className="mx-auto opacity-50"
              />
              <Anchor className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-blue-300" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-blue-600 mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              お探しのページが見つかりません
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              申し訳ございません。お探しのページは存在しないか、移動した可能性があります。
              <br />
              以下のリンクから明勝丸の情報をご覧ください。
            </p>
          </div>

          {/* 海の波装飾 */}
          <div className="mb-8">
            <svg className="w-full h-24 opacity-30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#3b82f6" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>

          {/* ナビゲーションカード */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Home className="mr-2 h-5 w-5" />
                  ホームページ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  明勝丸のメインページで最新情報をご確認ください。
                </p>
                <Button asChild className="w-full">
                  <Link href="/">
                    ホームに戻る
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Calendar className="mr-2 h-5 w-5" />
                  ご予約
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  白いか釣り体験のご予約はこちらから。
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/booking-methods">
                    予約方法を見る
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Search className="mr-2 h-5 w-5" />
                  よくある質問
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  釣りに関するご質問は FAQ をご確認ください。
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/faq">
                    FAQ を見る
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* お問い合わせ */}
          <Card className="bg-blue-50 border-blue-200 mb-8">
            <CardHeader>
              <CardTitle className="text-blue-800">お困りですか？</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-6">
                お探しの情報が見つからない場合は、お気軽にお問い合わせください。
                <br />
                船長が丁寧にご対応いたします。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <a href="tel:090-4695-3087">
                    <Phone className="mr-2 h-5 w-5" />
                    電話で問い合わせ
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="https://lin.ee/HQX3Ezq" target="_blank" rel="noopener noreferrer">
                    <Fish className="mr-2 h-5 w-5" />
                    LINE で問い合わせ
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* フッター装飾 */}
          <div className="text-gray-500 text-sm">
            <p>明勝丸 - 鳥取県琴浦町の白いか釣り専門船</p>
          </div>
        </div>
      </div>
    </div>
  );
}