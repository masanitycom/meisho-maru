'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createReservation, upsertCustomer, getAvailableSeats, resetSupabaseClient } from '@/lib/supabase-client';
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
  const [availableSeats, setAvailableSeats] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    tripNumber: '',
    peopleCount: '1',
    name: '',
    nameKana: '',
    phone: '',
    email: '',
    rodRental: 'false',
    rodRentalCount: '0',
    notes: '',
  });

  // コンポーネントマウント時にSupabaseクライアントをリセット
  useEffect(() => {
    resetSupabaseClient();
    console.log('Supabase client reset for reservation page');
  }, []);

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

  // 残席数を取得
  useEffect(() => {
    const fetchAvailableSeats = async () => {
      if (formData.date && formData.tripNumber) {
        try {
          const seats = await getAvailableSeats(formData.date, parseInt(formData.tripNumber));
          setAvailableSeats(seats);
        } catch (error) {
          console.error('残席数取得エラー:', error);
          setAvailableSeats(8); // エラー時はデフォルト値
        }
      }
    };
    
    fetchAvailableSeats();
  }, [formData.date, formData.tripNumber]);

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

      console.log('顧客データ保存開始:', customerData);
      try {
        const customerResult = await upsertCustomer(customerData);
        console.log('顧客データ保存成功:', customerResult);
      } catch (customerError) {
        console.error('顧客データ保存エラー:', customerError);
        throw customerError;
      }

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
        rod_rental_count: parseInt(formData.rodRentalCount) || 0,
        notes: formData.notes || undefined,
        source: 'web',
        status: 'confirmed' as const,
      };

      console.log('予約データ保存開始:', reservationData);
      try {
        const reservationResult = await createReservation(reservationData);
        console.log('予約データ保存成功:', reservationResult);
      } catch (reservationError) {
        console.error('予約データ保存エラー:', reservationError);
        throw reservationError;
      }
      
      // メール送信（お客様＋管理者）
      console.log('メール送信処理開始');
      try {
        const emailResponse = await fetch('/api/send-email-fallback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            nameKana: formData.nameKana,
            date: formData.date,
            tripNumber: parseInt(formData.tripNumber),
            peopleCount: parseInt(formData.peopleCount),
            rodRental: formData.rodRental === 'true',
            rodRentalCount: parseInt(formData.rodRentalCount) || 0,
            phone: formData.phone,
            notes: formData.notes
          })
        });

        const emailResult = await emailResponse.json();

        if (emailResult.success) {
          console.log('メール送信成功:', emailResult);
        } else {
          console.error('メール送信失敗（APIレスポンス）:', emailResult);
        }
      } catch (emailError) {
        console.error('メール送信エラー（例外）:', emailError);
        // メール送信失敗してもデータは保存されているので、処理を続行
        console.log('メール送信は失敗しましたが、予約データは保存されています');
      }
      
      // 予約詳細をURLパラメータとして渡してサンクスページにリダイレクト
      const params = new URLSearchParams({
        name: formData.name,
        email: formData.email || '',
        phone: formData.phone,
        date: formData.date,
        time: formData.tripNumber === '1' ? '1便（17:30過ぎ～23:30頃）' : '2便（24:00頃～5:30頃）',
        people: formData.peopleCount,
        rodRental: formData.rodRental,
        rodRentalCount: formData.rodRentalCount,
      });
      
      router.push(`/reservation/success?${params.toString()}`);
      
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
    const rodCount = parseInt(formData.rodRentalCount) || 0;
    const rodPrice = rodCount * 2000;
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
                    {availableSeats !== null && (
                      <span className="text-sm text-gray-600 ml-2">
                        （残席{availableSeats}席）
                      </span>
                    )}
                  </Label>
                  <Select
                    value={formData.peopleCount}
                    onValueChange={(value) => {
                      setFormData({...formData, peopleCount: value});
                      // 人数変更時に竿レンタル本数をリセット
                      if (parseInt(value) < parseInt(formData.rodRentalCount)) {
                        setFormData(prev => ({...prev, peopleCount: value, rodRentalCount: '0'}));
                      }
                    }}
                  >
                    <SelectTrigger id="people">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: Math.min(availableSeats || 8, 8) }, (_, i) => i + 1).map(n => (
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
                  <Label htmlFor="rodCount">
                    竿レンタル本数
                    <span className="text-sm text-gray-600 ml-2">（¥2,000/本）</span>
                  </Label>
                  <Select
                    value={formData.rodRentalCount}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData, 
                        rodRentalCount: value,
                        rodRental: value === '0' ? 'false' : 'true'
                      });
                    }}
                  >
                    <SelectTrigger id="rodCount">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">不要（0本）</SelectItem>
                      {Array.from({ length: parseInt(formData.peopleCount) || 1 }, (_, i) => i + 1).map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}本</SelectItem>
                      ))}
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
                    {parseInt(formData.rodRentalCount) > 0 && (
                      <div>竿レンタル: ¥2,000 × {formData.rodRentalCount}本</div>
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