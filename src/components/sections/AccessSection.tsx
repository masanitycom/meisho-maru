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
            鳥取県琴浦町赤碕港からの出航です
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
                    赤碕港より出航
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
                    <li>山陰自動車道「米子IC」から国道9号 車で約30分</li>
                    <li>JR鳥取駅から国道9号 約70分</li>
                    <li className="text-primary font-semibold">無料駐車場完備</li>
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
                    <li>JR赤碕駅からタクシーで約10分</li>
                    <li>JR赤碕駅からバスで約20分</li>
                    <li>「赤碕港入口」バス停下車、徒歩5分</li>
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
                      <p className="text-gray-600 mb-4">
                        赤碕港
                        <br />
                        <span className="text-sm">
                          {SITE_CONFIG.contact.address}
                        </span>
                      </p>
                      <a
                        href="https://maps.app.goo.gl/RrNkBLXPYakqmU6n8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Google Mapsで開く
                      </a>
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
                  <h4 className="font-semibold mb-2">1便</h4>
                  <p className="text-sm text-gray-600">
                    集合時間: 17:15
                    <br />
                    出船時間: 17:30過ぎ
                    <br />
                    帰港時間: 23:30頃
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2便</h4>
                  <p className="text-sm text-gray-600">
                    集合時間: 23:45
                    <br />
                    出航時間: 24:00頃
                    <br />
                    帰港時間: 5:30頃
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