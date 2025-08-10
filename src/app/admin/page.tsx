'use client';

import { useState, useEffect } from 'react';
import { createReservation, upsertCustomer, getReservations, getCustomers, deleteReservation, updateReservation } from '@/lib/supabase';
import { AdminAuth } from '@/components/auth/AdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  Edit,
  Trash2,
  Settings,
  Plus,
  Ship
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function NewReservationForm({ onReservationCreated }: { onReservationCreated: () => Promise<void> }) {
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
    source: 'phone', // phone, walk-in, etc
  });

  const [loading, setLoading] = useState(false);

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
        source: formData.source,
      };
      
      await createReservation(reservationData);
      
      alert('予約を登録しました。');
      
      // データを再読み込み
      await onReservationCreated();
      
      // フォームをリセット
      setFormData({
        date: '',
        tripNumber: '',
        peopleCount: '1',
        name: '',
        nameKana: '',
        phone: '',
        email: '',
        rodRental: 'false',
        notes: '',
        source: 'phone',
      });
      
    } catch (error) {
      console.error('予約登録エラー:', error);
      alert('予約の登録中にエラーが発生しました。もう一度お試しください。');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左列 */}
        <div className="space-y-4">
          {/* 予約元 */}
          <div className="space-y-2">
            <Label htmlFor="source">予約方法</Label>
            <Select
              value={formData.source}
              onValueChange={(value) => setFormData({...formData, source: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">電話予約</SelectItem>
                <SelectItem value="walk-in">店頭予約</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 日付 */}
          <div className="space-y-2">
            <Label htmlFor="date">乗船日</Label>
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
            <Label htmlFor="trip">便選択</Label>
            <Select
              value={formData.tripNumber}
              onValueChange={(value) => setFormData({...formData, tripNumber: value})}
            >
              <SelectTrigger>
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
            <Label htmlFor="people">人数</Label>
            <Select
              value={formData.peopleCount}
              onValueChange={(value) => setFormData({...formData, peopleCount: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <SelectItem key={n} value={n.toString()}>{n}名</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 竿レンタル */}
          <div className="space-y-2">
            <Label htmlFor="rod">竿レンタル</Label>
            <Select
              value={formData.rodRental}
              onValueChange={(value) => setFormData({...formData, rodRental: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">不要</SelectItem>
                <SelectItem value="true">必要（¥2,000/人）</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 右列 */}
        <div className="space-y-4">
          {/* お名前 */}
          <div className="space-y-2">
            <Label htmlFor="name">お名前</Label>
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
            <Label htmlFor="nameKana">フリガナ</Label>
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
            <Label htmlFor="phone">電話番号</Label>
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
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com（任意）"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* 備考 */}
          <div className="space-y-2">
            <Label htmlFor="notes">備考・メモ</Label>
            <Textarea
              id="notes"
              placeholder="電話での要望や特記事項"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </div>
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

      {/* ボタン */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="min-w-32"
        >
          <Plus className="mr-2 h-4 w-4" />
          {loading ? '登録中...' : '予約を登録'}
        </Button>
      </div>
    </form>
  );
}

interface Reservation {
  id: string;
  date: string;
  trip_number: number;
  people_count: number;
  name: string;
  phone: string;
  email?: string;
  rod_rental: boolean;
  status?: string;
}

interface Customer {
  id: string;
  name: string;
  name_kana: string;
  phone: string;
  email?: string;
  created_at: string;
}

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // データを読み込み
  const loadData = async () => {
    try {
      setLoading(true);
      const [reservationsData, customersData] = await Promise.all([
        getReservations(),
        getCustomers(),
      ]);
      setReservations(reservationsData || []);
      setCustomers(customersData || []);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadData();
    }
  }, [mounted]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />確定</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800"><AlertCircle className="h-3 w-3 mr-1" />待機</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />キャンセル</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTodayStats = () => {
    if (!mounted) return { trip1Count: 0, trip2Count: 0, todayRevenue: 0, totalReservations: 0 };
    
    const today = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => r.date === today);
    const trip1Count = todayReservations.filter(r => r.trip_number === 1).reduce((sum, r) => sum + r.people_count, 0);
    const trip2Count = todayReservations.filter(r => r.trip_number === 2).reduce((sum, r) => sum + r.people_count, 0);
    
    // 料金を計算（11,000 + 竿レンタル2,000）
    const todayRevenue = todayReservations.reduce((sum, r) => {
      const basePrice = 11000 * r.people_count;
      const rodPrice = r.rod_rental ? 2000 * r.people_count : 0;
      return sum + basePrice + rodPrice;
    }, 0);
    
    return { trip1Count, trip2Count, todayRevenue, totalReservations: todayReservations.length };
  };

  // 予約削除
  const handleDeleteReservation = async (reservationId: string, customerName: string) => {
    if (!confirm(`${customerName}様の予約を削除しますか？\nこの操作は取り消せません。`)) {
      return;
    }
    
    try {
      await deleteReservation(reservationId);
      alert('予約を削除しました');
      await loadData(); // データを再読み込み
    } catch (error) {
      console.error('予約削除エラー:', error);
      alert('予約の削除に失敗しました');
    }
  };

  // 予約ステータス変更
  const handleUpdateReservationStatus = async (reservationId: string, newStatus: string, customerName: string) => {
    try {
      await updateReservation(reservationId, { status: newStatus });
      alert(`${customerName}様の予約ステータスを「${newStatus}」に変更しました`);
      await loadData(); // データを再読み込み
    } catch (error) {
      console.error('ステータス更新エラー:', error);
      alert('ステータスの更新に失敗しました');
    }
  };

  // 確認メール送信
  const handleSendConfirmationEmail = async (reservation: Reservation) => {
    if (!reservation.email) {
      alert('メールアドレスが登録されていません');
      return;
    }
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: reservation.email,
          subject: '【明勝丸】ご予約確認のお知らせ',
          reservationData: {
            name: reservation.name,
            date: reservation.date,
            trip_number: reservation.trip_number,
            people_count: reservation.people_count,
            phone: reservation.phone,
            email: reservation.email,
            rod_rental: reservation.rod_rental,
            notes: ''
          }
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`${reservation.name}様に確認メールを送信しました`);
        // 開発環境ではメール内容をコンソールに表示
        if (result.emailPreview) {
          console.log('📧 送信予定メール内容:\n', result.emailPreview);
        }
      } else {
        alert('メール送信に失敗しました');
      }
    } catch (error) {
      console.error('メール送信エラー:', error);
      alert('メール送信に失敗しました');
    }
  };

  const stats = getTodayStats();

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">管理画面</h1>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            設定
          </Button>
        </div>

        {/* ダッシュボード統計 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">本日の予約</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReservations}件</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">1便乗船者</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.trip1Count}名</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">2便乗船者</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.trip2Count}名</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">本日売上</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥{stats.todayRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* タブメニュー */}
        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reservations">予約管理</TabsTrigger>
            <TabsTrigger value="new-reservation">新規予約</TabsTrigger>
            <TabsTrigger value="customers">顧客管理</TabsTrigger>
            <TabsTrigger value="schedule">運航管理</TabsTrigger>
          </TabsList>

          {/* 予約管理 */}
          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>予約一覧</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">日程</th>
                        <th className="text-left p-4">便</th>
                        <th className="text-left p-4">お客様</th>
                        <th className="text-left p-4">人数</th>
                        <th className="text-left p-4">金額</th>
                        <th className="text-left p-4">状態</th>
                        <th className="text-left p-4">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center">
                            読み込み中...
                          </td>
                        </tr>
                      ) : reservations.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500">
                            予約データがありません
                          </td>
                        </tr>
                      ) : (
                        reservations.map((reservation) => {
                          const amount = 11000 * reservation.people_count + (reservation.rod_rental ? 2000 * reservation.people_count : 0);
                          return (
                            <tr key={reservation.id} className="border-b">
                              <td className="p-4">{reservation.date}</td>
                              <td className="p-4">{reservation.trip_number}便</td>
                              <td className="p-4">
                                <div>
                                  <div className="font-medium">{reservation.name}</div>
                                  <div className="text-sm text-gray-600">
                                    <Phone className="inline h-3 w-3 mr-1" />
                                    {reservation.phone}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">{reservation.people_count}名</td>
                              <td className="p-4">¥{amount.toLocaleString()}</td>
                              <td className="p-4">{getStatusBadge(reservation.status || 'confirmed')}</td>
                              <td className="p-4">
                                <div className="flex gap-1 flex-wrap">
                                  {reservation.email && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleSendConfirmationEmail(reservation)}
                                      title="確認メール送信"
                                    >
                                      <Mail className="h-3 w-3" />
                                    </Button>
                                  )}
                                  
                                  {reservation.status !== 'confirmed' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmed', reservation.name)}
                                      title="予約確定"
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                    </Button>
                                  )}
                                  
                                  {reservation.status !== 'cancelled' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleUpdateReservationStatus(reservation.id, 'cancelled', reservation.name)}
                                      title="キャンセル"
                                      className="text-orange-600 hover:text-orange-700"
                                    >
                                      <XCircle className="h-3 w-3" />
                                    </Button>
                                  )}
                                  
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleDeleteReservation(reservation.id, reservation.name)}
                                    title="削除"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 新規予約 */}
          <TabsContent value="new-reservation">
            <Card>
              <CardHeader>
                <CardTitle>新規予約登録</CardTitle>
                <p className="text-sm text-gray-600">電話予約などの管理者による予約登録</p>
              </CardHeader>
              <CardContent>
                <NewReservationForm onReservationCreated={loadData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 顧客管理 */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>顧客一覧</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">お客様情報</th>
                        <th className="text-left p-4">連絡先</th>
                        <th className="text-left p-4">利用回数</th>
                        <th className="text-left p-4">最終利用</th>
                        <th className="text-left p-4">累計金額</th>
                        <th className="text-left p-4">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center">
                            読み込み中...
                          </td>
                        </tr>
                      ) : customers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500">
                            顧客データがありません
                          </td>
                        </tr>
                      ) : (
                        customers.map((customer) => (
                          <tr key={customer.id} className="border-b">
                            <td className="p-4">
                              <div>
                                <div className="font-medium">{customer.name}</div>
                                <div className="text-sm text-gray-600">{customer.name_kana}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                <div className="flex items-center gap-1 mb-1">
                                  <Phone className="h-3 w-3" />
                                  {customer.phone}
                                </div>
                                {customer.email && (
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {customer.email}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="secondary">-回</Badge>
                            </td>
                            <td className="p-4">{customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '-'}</td>
                            <td className="p-4">-</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 運航管理 */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ship className="mr-2 h-5 w-5" />
                  運航管理
                </CardTitle>
                <p className="text-sm text-gray-600">残席調整・休業日設定を簡単操作で行えます</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
                    <Ship className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                    <h3 className="text-lg font-bold mb-2">スケジュール調整</h3>
                    <p className="text-gray-600 mb-4">
                      各日の定員数調整や運航状態の切り替えを大きなボタンで簡単操作
                    </p>
                    <Button asChild className="w-full h-12 text-lg">
                      <Link href="/admin/schedule">
                        <Calendar className="mr-2 h-5 w-5" />
                        運航管理画面へ
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      主な機能
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ➕➖ボタンで定員数を調整（最大20席）
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ワンクリックで運航ON/OFF切り替え
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        期間指定で連続休業日設定
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        リアルタイム空席数表示
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        大きなボタンで操作しやすい設計
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AdminAuth>
  );
}