'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Phone, MessageCircle, Share2, Instagram, MapPin, Video } from 'lucide-react';
import { ACCESS_VIDEOS, ACCESS_VIDEOS_ARE_VERTICAL, youtubeEmbedUrl } from '@/lib/constants';

function ReservationSuccessContent() {
  const searchParams = useSearchParams();
  const [reservationData, setReservationData] = useState<{
    name: string | null;
    email: string | null;
    phone: string | null;
    date: string | null;
    time: string | null;
    people: string | null;
    rodRental: string | null;
    rodRentalCount: string | null;
  } | null>(null);

  useEffect(() => {
    // URLパラメータから予約情報を取得
    const data = {
      name: searchParams.get('name'),
      email: searchParams.get('email'),
      phone: searchParams.get('phone'),
      date: searchParams.get('date'),
      time: searchParams.get('time'),
      people: searchParams.get('people'),
      rodRental: searchParams.get('rodRental'),
      rodRentalCount: searchParams.get('rodRentalCount'),
    };
    setReservationData(data);
  }, [searchParams]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '明勝丸で白いか釣り体験',
        text: '鳥取県琴浦町の白いか釣り専門船「明勝丸」で釣り体験をしました！',
        url: 'https://kotourameishomaru.com',
      });
    } else {
      // フォールバック：クリップボードにコピー
      navigator.clipboard.writeText('https://kotourameishomaru.com');
      alert('URLをクリップボードにコピーしました');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 成功メッセージ */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ご予約ありがとうございます！
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ご予約を正常に受け付けました。確認メールをお送りいたしましたので、ご確認ください。
            </p>
          </div>

          {/* 予約詳細 */}
          {reservationData && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  ご予約内容
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">お名前</p>
                    <p className="font-semibold">{reservationData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">メールアドレス</p>
                    <p className="font-semibold">{reservationData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">電話番号</p>
                    <p className="font-semibold">{reservationData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">希望日</p>
                    <p className="font-semibold">{reservationData.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">希望便</p>
                    <p className="font-semibold">{reservationData.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">人数</p>
                    <p className="font-semibold">{reservationData.people}名</p>
                  </div>
                  {reservationData.rodRental === 'true' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">竿レンタル</p>
                        <p className="font-semibold">あり</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">レンタル竿数</p>
                        <p className="font-semibold">{reservationData.rodRentalCount}本</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 次のステップ */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>次のステップ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">確認メールの確認</p>
                    <p className="text-gray-600 text-sm">
                      ご登録いただいたメールアドレスに確認メールをお送りしました。内容をご確認ください。
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">当日の集合</p>
                    <p className="text-gray-600 text-sm">
                      鳥取県琴浦町赤碕港にお越しください。詳細は確認メールに記載されています。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ご要望・ご質問はLINEへ */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-6 w-6 flex-shrink-0 text-green-600 mt-0.5" />
                <div className="w-full">
                  <h3 className="font-semibold text-gray-900 mb-1">ご要望・ご質問はLINEへ</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    お迎え場所のご相談、お子様連れ・アレルギー等のご要望、その他ご質問は、LINE公式アカウントへお気軽にお送りください。個別にご返信いたします。
                  </p>
                  <Button asChild className="bg-[#06C755] hover:bg-[#05b34c] text-white w-full sm:w-auto">
                    <a href="https://lin.ee/mMWHmB0" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      LINEで問い合わせ
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 乗り場・乗船位置の案内動画 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                乗り場までの行き方・乗船位置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-6">
                当日スムーズにお越しいただけるよう、乗り場までの行き方と乗船位置を動画でご案内します。ぜひ事前にご覧ください。
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {ACCESS_VIDEOS.map((video, index) => (
                  <div key={index}>
                    {/* 縦型(Shorts)は 9:16、横型は 16:9 */}
                    {video.youtubeId ? (
                      <div className="relative mx-auto w-full max-w-[320px] overflow-hidden rounded-lg bg-black" style={{ paddingTop: ACCESS_VIDEOS_ARE_VERTICAL ? '177.78%' : '56.25%' }}>
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src={youtubeEmbedUrl(video.youtubeId)}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="relative mx-auto w-full max-w-[320px] rounded-lg bg-gray-100 text-gray-400" style={{ paddingTop: ACCESS_VIDEOS_ARE_VERTICAL ? '177.78%' : '56.25%' }}>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Video className="mb-2 h-8 w-8" />
                          <span className="text-sm">動画準備中</span>
                        </div>
                      </div>
                    )}
                    <p className="mt-3 text-center font-semibold text-gray-900">{video.title}</p>
                    <p className="text-center text-sm text-gray-600">{video.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* アクション */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">お問い合わせ</h3>
                <p className="text-gray-600 text-sm mb-4">
                  ご不明な点がございましたら、お気軽にお問い合わせください。
                </p>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <a href="tel:090-4695-3087" className="flex items-center justify-center">
                      <Phone className="mr-2 h-4 w-4" />
                      電話で問い合わせ
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="https://lin.ee/mMWHmB0" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      LINEで問い合わせ
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">体験をシェア</h3>
                <p className="text-gray-600 text-sm mb-4">
                  ご友人やご家族に明勝丸の釣り体験をシェアしませんか？
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full flex items-center justify-center" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    シェアする
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="https://www.instagram.com/meisho_maru/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <Instagram className="mr-2 h-4 w-4" />
                      Instagram をフォロー
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ホームに戻る */}
          <div className="text-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/" className="flex items-center justify-center">
                <Calendar className="mr-2 h-5 w-5" />
                ホームに戻る
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReservationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Calendar className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              読み込み中...
            </h1>
          </div>
        </div>
      </div>
    }>
      <ReservationSuccessContent />
    </Suspense>
  );
}