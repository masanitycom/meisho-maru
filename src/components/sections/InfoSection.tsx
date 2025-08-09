import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Anchor, Users, Shield, Wifi } from 'lucide-react';
import { PRICES } from '@/lib/constants';

export function InfoSection() {
  return (
    <section id="info" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">料金・設備</h2>
          <p className="text-xl text-gray-600">
            充実した設備と安心の料金体系
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">料金プラン</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">大人料金</h4>
                    <span className="text-2xl font-bold text-primary">
                      ¥{PRICES.adult.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    1名様あたり / 6時間
                  </p>
                </div>

                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">竿レンタル</h4>
                    <span className="text-2xl font-bold text-primary">
                      ¥{PRICES.rodRental.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    初心者の方も手ぶらでOK
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">料金に含まれるもの</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>乗船料</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>エサ代</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>氷</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>救命胴衣</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">船内設備</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Anchor className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">最新設備完備</h4>
                    <p className="text-sm text-gray-600">
                      GPS魚群探知機、電動リール対応
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">定員10名</h4>
                    <p className="text-sm text-gray-600">
                      ゆったりとした釣り座でストレスフリー
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">安全対策万全</h4>
                    <p className="text-sm text-gray-600">
                      救命胴衣完備、保険加入済み
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Wifi className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">便利な設備</h4>
                    <p className="text-sm text-gray-600">
                      トイレ、キャビン、無料Wi-Fi完備
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold text-amber-700">初心者歓迎！</span>
                  <br />
                  ベテラン船長が丁寧にサポートいたします。
                  道具の使い方から釣り方まで、お気軽にお尋ねください。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}