import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: '田中 様',
    age: '40代',
    date: '2025年8月',
    rating: 5,
    comment: '初めての白いか釣りでしたが、船長さんが丁寧に教えてくださり、たくさん釣ることができました。また利用したいです！',
  },
  {
    id: 2,
    name: '山田 様',
    age: '30代',
    date: '2025年7月',
    rating: 5,
    comment: '友人と3人で参加しました。船長の経験豊富な判断で良いポイントに連れて行ってもらい、大満足の釣果でした。',
  },
  {
    id: 3,
    name: '佐藤 様',
    age: '50代',
    date: '2025年6月',
    rating: 5,
    comment: '何度も利用していますが、いつも安全で楽しい釣りができます。初心者の方にもおすすめです。',
  },
  {
    id: 4,
    name: '鈴木 様',
    age: '20代',
    date: '2025年5月',
    rating: 5,
    comment: '職場の仲間と利用しました。全員初心者でしたが、船長のサポートのおかげで全員釣ることができて最高の思い出になりました！',
  },
  {
    id: 5,
    name: '高橋 様',
    age: '60代',
    date: '2025年4月',
    rating: 5,
    comment: '孫と一緒に参加しました。安全面もしっかりしていて、孫も大喜びでした。家族での思い出作りに最適です。',
  },
  {
    id: 6,
    name: '伊藤 様',
    age: '40代',
    date: '2025年3月',
    rating: 5,
    comment: '釣果も素晴らしかったですが、何より船長の人柄が良く、楽しい時間を過ごせました。リピート確定です！',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">お客様の声</h2>
          <p className="text-xl text-gray-600">
            実際にご利用いただいたお客様からの声をご紹介します
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <Quote className="h-8 w-8 text-blue-200 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {testimonial.comment}
                    </p>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-sm">
                          {testimonial.name} ({testimonial.age})
                        </p>
                        <p className="text-xs text-gray-500">
                          {testimonial.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600">
            ※ お客様の個人情報保護のため、お名前は仮名で掲載しております
          </p>
        </div>
      </div>
    </section>
  );
}