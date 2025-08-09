import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Car, Train, Clock } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export function AccessSection() {
  return (
    <section id="access" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">アクセス</h2>
          <p className="text-xl text-gray-600">
            鳥取市賀露港からの出航です
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    所在地
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-2">{SITE_CONFIG.contact.address}</p>
                  <p className="text-sm text-gray-600">
                    賀露港西防波堤付近
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="mr-2 h-5 w-5 text-primary" />
                    お車でお越しの方
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>鳥取自動車道「鳥取IC」から約15分</li>
                    <li>国道9号線から県道318号線経由</li>
                    <li className="text-primary font-semibold">無料駐車場完備（20台）</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Train className="mr-2 h-5 w-5 text-primary" />
                    公共交通機関でお越しの方
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>JR鳥取駅からタクシーで約15分</li>
                    <li>JR鳥取駅からバスで約20分</li>
                    <li>「賀露港」バス停下車、徒歩5分</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="h-full min-h-[400px]">
              <Card className="h-full">
                <CardContent className="p-0 h-full">
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        地図エリア
                        <br />
                        <span className="text-sm">
                          Google Maps等の地図サービスを
                          <br />
                          埋め込むことができます
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                集合時間のご案内
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">午前便</h4>
                  <p className="text-sm text-gray-600">
                    集合時間: 5:30
                    <br />
                    出航時間: 6:00
                    <br />
                    ※出航15分前までにお越しください
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">午後便</h4>
                  <p className="text-sm text-gray-600">
                    集合時間: 12:30
                    <br />
                    出航時間: 13:00
                    <br />
                    ※出航15分前までにお越しください
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">
                  <span className="font-semibold">ご注意</span>
                  <br />
                  天候により欠航となる場合がございます。
                  前日の夕方に運航可否をご連絡いたします。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}