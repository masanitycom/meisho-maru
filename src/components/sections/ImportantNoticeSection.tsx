import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Snowflake, Trash2, Cloud, AlertCircle } from 'lucide-react';

export function ImportantNoticeSection() {
  return (
    <section id="important-notice" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">ご利用にあたってのお願い</h2>
          <p className="text-xl text-gray-600">
            安全で快適な釣り体験のため、ご協力をお願いいたします
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* 氷について */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Snowflake className="mr-3 h-6 w-6 text-blue-500" />
                氷のご利用について
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                氷は無料でご用意しておりますが、船内の保管量には限りがございます。
                大型クーラーボックスをお持ちの方や、大量の氷が必要な方は、
                事前にご自身でもご準備いただけますようお願いいたします。
              </p>
              <p className="text-sm text-blue-600 mt-3 font-semibold">
                ※ 全てのお客様に快適にご利用いただくためのご協力をお願いします
              </p>
            </CardContent>
          </Card>

          {/* ゴミについて */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Trash2 className="mr-3 h-6 w-6 text-green-500" />
                ゴミの持ち帰りについて
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                海の環境保護のため、ゴミは必ず各自でお持ち帰りください。
                美しい日本海を次世代に残すため、皆様のご協力が不可欠です。
              </p>
              <p className="text-sm text-green-600 mt-3 font-semibold">
                ※ ゴミ袋はご持参ください
              </p>
            </CardContent>
          </Card>

          {/* 天候について */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Cloud className="mr-3 h-6 w-6 text-gray-500" />
                出航判断について
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                お客様の安全を最優先に、悪天候時や海況不良の場合は、
                船長の判断により出航中止または早期帰港となる場合がございます。
                安全運航へのご理解をお願いいたします。
              </p>
              <p className="text-sm text-orange-600 mt-3 font-semibold">
                ※ 出航可否は当日の判断となります
              </p>
            </CardContent>
          </Card>

          {/* その他の注意事項 */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <AlertCircle className="mr-3 h-6 w-6 text-red-500" />
                その他のご注意
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">●</span>
                  <span>船内にトイレ設備はございません。出航前にお済ませください。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">●</span>
                  <span>危険な行為や他のお客様のご迷惑となる行為は固くお断りいたします。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">●</span>
                  <span>船長の指示には必ず従っていただきますようお願いいたします。</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 重要メッセージ */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                安全で楽しい釣り体験のために
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                明勝丸では、皆様に安心・安全で快適な釣り体験をご提供するため、
                上記のルールを設けております。
                お客様一人ひとりのご協力により、素晴らしい海釣りの思い出をお作りいただけます。
                ご理解とご協力を心よりお願い申し上げます。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}