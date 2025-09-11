'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Anchor, HelpCircle, Phone, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FAQItem {
  category: string;
  question: string;
  answer: string;
  keywords?: string[];
}

const faqData: FAQItem[] = [
  // 予約関連
  {
    category: '予約について',
    question: '予約方法を教えてください',
    answer: 'お電話（予約専用ダイヤル 090-4695-3087）、LINE、Webフォームからご予約いただけます。電話予約が最も確実です。予約時には、ご希望の日時（第1便または第2便）、参加人数、竿レンタルの有無をお伝えください。',
    keywords: ['予約', '申し込み', '電話', 'LINE', 'Web'],
  },
  {
    category: '予約について',
    question: 'キャンセル料はかかりますか？',
    answer: 'キャンセルは3日前までにご連絡いただければキャンセル料はかかりません。天候による欠航の場合もキャンセル料は不要です。前日夕方に運航可否をご連絡いたします。',
    keywords: ['キャンセル', '料金', '天候', '欠航'],
  },
  {
    category: '予約について',
    question: '当日予約は可能ですか？',
    answer: '空席があれば当日予約も可能です。お電話（予約専用ダイヤル 090-4695-3087）でお問い合わせください。ただし、事前予約をおすすめします。',
    keywords: ['当日', '予約', '空席'],
  },
  
  // 料金関連
  {
    category: '料金について',
    question: '料金はいくらですか？',
    answer: '乗船料は1名様11,000円（税込）です。竿レンタルをご希望の場合は、1本2,000円でご用意しております。仕掛けは料金に含まれています。',
    keywords: ['料金', '価格', '費用', '値段'],
  },
  {
    category: '料金について',
    question: '支払い方法は何がありますか？',
    answer: '現金でのお支払いをお願いしております。乗船前にお支払いください。',
    keywords: ['支払い', '現金', '決済'],
  },
  {
    category: '料金について',
    question: '子供料金はありますか？',
    answer: '申し訳ございませんが、子供料金の設定はございません。安全管理上、小学生以上から同一料金でご乗船いただいております。',
    keywords: ['子供', '料金', '小学生'],
  },
  
  // 釣りについて
  {
    category: '釣りについて',
    question: '初心者でも釣れますか？',
    answer: '初心者の方でも大丈夫です！船長が丁寧に釣り方をお教えします。実際に初めての方でも多くの方が釣果を上げています。道具の使い方から釣り方まで、しっかりサポートいたします。',
    keywords: ['初心者', '初めて', '未経験', 'サポート'],
  },
  {
    category: '釣りについて',
    question: '白いかのシーズンはいつですか？',
    answer: '白いかの最盛期は6月〜10月です。特に7月〜9月が最も釣果が期待できる時期です。ただし、海況により変動することがあります。',
    keywords: ['シーズン', '時期', '白いか', 'いつ'],
  },
  {
    category: '釣りについて',
    question: '釣った白いかは持ち帰れますか？',
    answer: 'もちろん、釣った白いかはすべてお持ち帰りいただけます。クーラーボックスと氷をご持参ください。船上での簡単な処理方法もお教えします。',
    keywords: ['持ち帰り', '白いか', 'クーラーボックス', '氷'],
  },
  {
    category: '釣りについて',
    question: '釣具をレンタルできますか？',
    answer: '竿のレンタルは1本2,000円でご用意しております。仕掛けは料金に含まれています。初心者の方にはレンタルをおすすめします。',
    keywords: ['レンタル', '釣具', '竿', '道具'],
  },
  
  // アクセス関連
  {
    category: 'アクセスについて',
    question: '集合場所はどこですか？',
    answer: '鳥取県東伯郡琴浦町大字別所１１２８番地が目印住所です。乗船場所は【株式会社 鳥取林養魚場】の建物裏手、赤碕港になります。出港時間の15分前までにお越しください。',
    keywords: ['集合場所', 'アクセス', '赤碕港', '住所'],
  },
  {
    category: 'アクセスについて',
    question: '駐車場はありますか？',
    answer: '無料駐車場を完備しております。大型車にも対応しています。',
    keywords: ['駐車場', '車', '無料'],
  },
  {
    category: 'アクセスについて',
    question: '大阪・広島から車でどのくらいかかりますか？',
    answer: '大阪からは約3時間、広島からは約2.5時間、岡山からは約2時間、名古屋からは約4時間です。高速道路を利用した場合の目安時間です。',
    keywords: ['大阪', '広島', '岡山', '名古屋', 'アクセス', '時間'],
  },
  
  // 安全・設備
  {
    category: '安全・設備について',
    question: '船にトイレはありますか？',
    answer: '申し訳ございませんが、船にトイレはございません。乗船前に済ませていただくようお願いいたします。',
    keywords: ['トイレ', '設備'],
  },
  {
    category: '安全・設備について',
    question: '救命胴衣は必要ですか？',
    answer: '救命胴衣は船に完備しており、乗船時には必ず着用していただきます。お子様用サイズもご用意しております。',
    keywords: ['救命胴衣', '安全', 'ライフジャケット'],
  },
  {
    category: '安全・設備について',
    question: '雨天でも出港しますか？',
    answer: '小雨程度なら出港しますが、波が高い場合や強風の場合は安全のため欠航となります。前日夕方に判断し、ご連絡いたします。',
    keywords: ['雨', '天気', '欠航', '天候'],
  },
  
  // その他
  {
    category: 'その他',
    question: '何を持っていけばいいですか？',
    answer: 'クーラーボックス、氷、タオル、飲み物、軽食をご持参ください。船酔いが心配な方は酔い止め薬もお持ちください。防寒着（夜は冷えます）もあると安心です。',
    keywords: ['持ち物', '準備', 'クーラーボックス', '氷'],
  },
  {
    category: 'その他',
    question: '船酔いが心配です',
    answer: '事前に酔い止め薬を服用されることをおすすめします。また、空腹・満腹を避け、軽めの食事を取ってからご乗船ください。船の揺れが少ない中央部分に座ることも効果的です。',
    keywords: ['船酔い', '酔い止め', '薬'],
  },
  {
    category: 'その他',
    question: '女性や子供でも大丈夫ですか？',
    answer: '女性のお客様も多くご利用いただいております。お子様は小学生以上から乗船可能です。家族連れでのご利用も歓迎いたします。',
    keywords: ['女性', '子供', '家族', '小学生'],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('すべて');

  const categories = ['すべて', ...Array.from(new Set(faqData.map(item => item.category)))];
  const filteredFAQ = selectedCategory === 'すべて' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">よくあるご質問</h1>
            <p className="text-lg text-gray-600">
              鳥取県琴浦町の白いか釣り船「明勝丸」に関するよくあるご質問をまとめました
            </p>
          </div>

          {/* カテゴリーボタン */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* FAQ一覧 */}
          <div className="space-y-4">
            {filteredFAQ.map((item, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader
                  className="cursor-pointer bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white transition-colors"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h2 className="font-semibold text-lg">{item.question}</h2>
                        <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                      </div>
                    </div>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
                {openItems.includes(index) && (
                  <CardContent className="pt-4 pb-6 bg-white">
                    <p className="text-gray-700 leading-relaxed pl-8">
                      {item.answer}
                    </p>
                    {item.keywords && (
                      <div className="mt-4 pl-8">
                        <div className="flex flex-wrap gap-2">
                          {item.keywords.map((keyword, kidx) => (
                            <span
                              key={kidx}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              #{keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* お問い合わせセクション */}
          <Card className="mt-12 bg-gradient-to-r from-blue-50 to-white">
            <CardContent className="py-8">
              <div className="text-center">
                <Anchor className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">その他のご質問はお気軽にお問い合わせください</h2>
                <p className="text-gray-600 mb-6">
                  鳥取県琴浦町赤碕港の白いか釣り専門船「明勝丸」へのご質問・ご予約はこちら
                </p>
                <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-semibold">お電話</p>
                      <a href="tel:090-4695-3087" className="text-blue-600 hover:underline">
                        090-4695-3087
                      </a>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="font-semibold">LINE予約</p>
                      <a href="https://lin.ee/HQX3Ezq" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                        LINEで予約
                      </a>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="font-semibold">アクセス</p>
                      <Link href="/#access" className="text-orange-600 hover:underline">
                        地図を見る
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* トップに戻る */}
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/">トップページに戻る</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}