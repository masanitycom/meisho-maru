import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Anchor, Users, Shield } from 'lucide-react';
import { PRICES } from '@/lib/constants';

export function InfoSection() {
  return (
    <section id="info" className="py-20 bg-gradient-to-b from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* 船の設備と海底 */}
      <div className="absolute inset-0" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* 波紋パターン */}
            <pattern id="ocean-floor" x="0" y="0" width="100" height="30" patternUnits="userSpaceOnUse">
              <path d="M0,15 Q25,5 50,15 Q75,25 100,15" fill="none" stroke="rgb(99 102 241 / 0.06)" strokeWidth="1" />
              <path d="M0,20 Q25,10 50,20 Q75,30 100,20" fill="none" stroke="rgb(99 102 241 / 0.04)" strokeWidth="0.8" />
            </pattern>
            
            {/* 船のシルエット */}
            <g id="boat-silhouette">
              <path d="M0,8 Q10,0 30,0 Q50,0 60,8 L55,12 Q30,15 5,12 Z" fill="rgb(99 102 241 / 0.12)" />
              <rect x="25" y="0" width="2" height="-8" fill="rgb(99 102 241 / 0.15)" />
              <path d="M20,-8 L30,-8 L25,-12 Z" fill="rgb(99 102 241 / 0.1)" />
            </g>
            
            {/* GPS電波 */}
            <g id="gps-signal">
              <circle cx="10" cy="10" r="8" fill="none" stroke="rgb(34 197 94 / 0.15)" strokeWidth="1" />
              <circle cx="10" cy="10" r="5" fill="none" stroke="rgb(34 197 94 / 0.2)" strokeWidth="1" />
              <circle cx="10" cy="10" r="2" fill="rgb(34 197 94 / 0.25)" />
            </g>
            
            {/* 魚群探知機の音波 */}
            <g id="sonar-waves">
              <path d="M10,0 Q15,10 10,20 Q5,10 10,0" fill="rgb(6 182 212 / 0.08)" />
              <path d="M8,5 Q12,10 8,15" fill="none" stroke="rgb(6 182 212 / 0.15)" strokeWidth="1" />
              <path d="M12,5 Q16,10 12,15" fill="none" stroke="rgb(6 182 212 / 0.12)" strokeWidth="0.8" />
            </g>
          </defs>
          
          {/* 海底背景 */}
          <rect width="100%" height="100%" fill="url(#ocean-floor)" />
          
          {/* 船の配置 */}
          <use href="#boat-silhouette" x="200" y="100" transform="scale(1.2)" opacity="0.3" />
          <use href="#boat-silhouette" x="800" y="150" transform="scale(0.8) rotate(5)" opacity="0.4" />
          
          {/* GPS信号 */}
          <use href="#gps-signal" x="250" y="80" opacity="0.5" />
          <use href="#gps-signal" x="830" y="130" transform="scale(0.7)" opacity="0.6" />
          
          {/* 魚群探知機の音波 */}
          <use href="#sonar-waves" x="270" y="200" opacity="0.4" />
          <use href="#sonar-waves" x="280" y="210" transform="scale(1.2)" opacity="0.3" />
          <use href="#sonar-waves" x="850" y="250" transform="scale(0.9)" opacity="0.5" />
          <use href="#sonar-waves" x="860" y="260" transform="scale(1.1)" opacity="0.4" />
          
          {/* 魚影 */}
          <ellipse cx="400" cy="400" rx="8" ry="3" fill="rgb(6 182 212 / 0.2)" transform="rotate(15)" />
          <ellipse cx="420" cy="410" rx="6" ry="2" fill="rgb(6 182 212 / 0.15)" transform="rotate(-10)" />
          <ellipse cx="700" cy="350" rx="10" ry="4" fill="rgb(6 182 212 / 0.18)" transform="rotate(25)" />
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
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
                    <h4 className="font-semibold mb-1">最新設備</h4>
                    <p className="text-sm text-gray-600">
                      GPS魚群探知機完備
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">定員8名</h4>
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