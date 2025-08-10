'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createReservation, upsertCustomer } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, Phone, Mail, User, AlertCircle } from 'lucide-react';

function ReservationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    tripNumber: '',
    peopleCount: '1',
    name: '',
    nameKana: '',
    phone: '',
    email: '',
    rodRental: 'false',
    notes: '',
  });

  // URLパラメーターから日付と便の情報を取得
  useEffect(() => {
    const dateParam = searchParams.get('date');
    const tripParam = searchParams.get('trip');
    
    if (dateParam) {
      setFormData(prev => ({ ...prev, date: dateParam }));
    }
    if (tripParam) {
      setFormData(prev => ({ ...prev, tripNumber: tripParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 顧客データを作成またはアップデート
      const customerData = {
        name: formData.name,
        name_kana: formData.nameKana,
        phone: formData.phone,
        email: formData.email || undefined,
      };
      
      await upsertCustomer(customerData);
      
      // 予約データを作成
      const reservationData = {
        date: formData.date,
        trip_number: parseInt(formData.tripNumber),
        people_count: parseInt(formData.peopleCount),
        name: formData.name,
        name_kana: formData.nameKana,
        phone: formData.phone,
        email: formData.email || undefined,
        rod_rental: formData.rodRental === 'true',
        notes: formData.notes || undefined,
        source: 'web',
      };
      
      const createdReservation = await createReservation(reservationData);
      
      // メール送信
      if (formData.email) {
        try {
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: formData.email,
              subject: '【明勝丸】ご予約ありがとうございます',
              reservationData: {
                name: formData.name,
                date: formData.date,
                trip_number: parseInt(formData.tripNumber),
                people_count: parseInt(formData.peopleCount),
                phone: formData.phone,
                email: formData.email,
                rod_rental: formData.rodRental === 'true',
                notes: formData.notes
              }
            })
          });
          
          if (emailResponse.ok) {
            alert('予約を受け付けました。確認メールをお送りしました。');
          } else {
            alert('予約を受け付けましたが、確認メールの送信に失敗しました。');
          }
        } catch (emailError) {
          console.error('メール送信エラー:', emailError);
          alert('予約を受け付けましたが、確認メールの送信に失敗しました。');
        }
      } else {
        alert('予約を受け付けました。');
      }
      
      router.push('/');
      
    } catch (error) {
      console.error('予約エラー:', error);
      alert('予約の処理中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const people = parseInt(formData.peopleCount) || 0;
    const basePrice = 11000 * people;
    const rodPrice = formData.rodRental === 'true' ? 2000 * people : 0;
    return basePrice + rodPrice;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">予約フォーム</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>ご予約情報を入力してください</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 日付選択 */}
                <div className="space-y-2">
                  <Label htmlFor="date">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    乗船日
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                {/* 便選択 */}
                <div className="space-y-2">
                  <Label htmlFor="trip">
                    <Clock className="inline h-4 w-4 mr-1" />
                    便選択
                  </Label>
                  <Select
                    value={formData.tripNumber}
                    onValueChange={(value) => setFormData({...formData, tripNumber: value})}
                  >
                    <SelectTrigger id="trip">
                      <SelectValue placeholder="便を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1便（17:30過ぎ〜23:30頃）</SelectItem>
                      <SelectItem value="2">2便（24:00頃〜5:30頃）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 人数 */}
                <div className="space-y-2">
                  <Label htmlFor="people">
                    <Users className="inline h-4 w-4 mr-1" />
                    人数
                  </Label>
                  <Select
                    value={formData.peopleCount}
                    onValueChange={(value) => setFormData({...formData, peopleCount: value})}
                  >
                    <SelectTrigger id="people">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}名</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* お名前 */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="inline h-4 w-4 mr-1" />
                    お名前
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="山田 太郎"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                {/* フリガナ */}
                <div className="space-y-2">
                  <Label htmlFor="nameKana">
                    <User className="inline h-4 w-4 mr-1" />
                    フリガナ
                  </Label>
                  <Input
                    id="nameKana"
                    type="text"
                    required
                    placeholder="ヤマダ タロウ"
                    value={formData.nameKana}
                    onChange={(e) => setFormData({...formData, nameKana: e.target.value})}
                  />
                </div>

                {/* 電話番号 */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="inline h-4 w-4 mr-1" />
                    電話番号
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="090-1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                {/* メールアドレス */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline h-4 w-4 mr-1" />
                    メールアドレス
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                {/* 竿レンタル */}
                <div className="space-y-2">
                  <Label htmlFor="rod">
                    竿レンタル
                  </Label>
                  <Select
                    value={formData.rodRental}
                    onValueChange={(value) => setFormData({...formData, rodRental: value})}
                  >
                    <SelectTrigger id="rod">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">不要</SelectItem>
                      <SelectItem value="true">必要（¥2,000/人）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 備考 */}
                <div className="space-y-2">
                  <Label htmlFor="notes">
                    備考・ご要望
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="ご要望やご質問があればご記入ください"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                {/* 料金表示 */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">合計金額</span>
                    <span className="text-2xl font-bold text-primary">
                      ¥{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <div>乗船料: ¥11,000 × {formData.peopleCount}名</div>
                    {formData.rodRental === 'true' && (
                      <div>竿レンタル: ¥2,000 × {formData.peopleCount}名</div>
                    )}
                  </div>
                </div>

                {/* 注意事項 */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-1">ご注意事項</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>天候により欠航となる場合があります</li>
                        <li>前日の夕方に運航可否をご連絡いたします</li>
                        <li>キャンセルは3日前までにご連絡ください</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* ボタン */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push('/')}
                  >
                    戻る
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? '送信中...' : '予約する'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">読み込み中...</div>}>
      <ReservationForm />
    </Suspense>
  );
}