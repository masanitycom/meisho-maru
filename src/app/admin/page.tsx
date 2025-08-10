'use client';

import { useState } from 'react';
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
  Settings
} from 'lucide-react';

export default function AdminPage() {
  const [reservations] = useState([
    {
      id: '1',
      date: '2025-01-15',
      tripNumber: 1,
      customerName: '田中 一郎',
      phone: '090-1234-5678',
      email: 'tanaka@example.com',
      peopleCount: 2,
      status: 'confirmed',
      rodRental: true,
      amount: 26000,
      createdAt: '2025-01-10',
    },
    {
      id: '2',
      date: '2025-01-15',
      tripNumber: 2,
      customerName: '佐藤 花子',
      phone: '080-9876-5432',
      email: 'sato@example.com',
      peopleCount: 1,
      status: 'confirmed',
      rodRental: false,
      amount: 11000,
      createdAt: '2025-01-12',
    },
    {
      id: '3',
      date: '2025-01-16',
      tripNumber: 1,
      customerName: '鈴木 太郎',
      phone: '070-5555-4444',
      email: 'suzuki@example.com',
      peopleCount: 3,
      status: 'pending',
      rodRental: true,
      amount: 39000,
      createdAt: '2025-01-13',
    },
  ]);

  const [customers] = useState([
    {
      id: '1',
      name: '田中 一郎',
      nameKana: 'タナカ イチロウ',
      phone: '090-1234-5678',
      email: 'tanaka@example.com',
      visitCount: 5,
      lastVisit: '2025-01-15',
      totalAmount: 130000,
    },
    {
      id: '2',
      name: '佐藤 花子',
      nameKana: 'サトウ ハナコ',
      phone: '080-9876-5432',
      email: 'sato@example.com',
      visitCount: 2,
      lastVisit: '2025-01-15',
      totalAmount: 22000,
    },
  ]);

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
    const today = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => r.date === today);
    const trip1Count = todayReservations.filter(r => r.tripNumber === 1).reduce((sum, r) => sum + r.peopleCount, 0);
    const trip2Count = todayReservations.filter(r => r.tripNumber === 2).reduce((sum, r) => sum + r.peopleCount, 0);
    const todayRevenue = todayReservations.reduce((sum, r) => sum + r.amount, 0);
    
    return { trip1Count, trip2Count, todayRevenue, totalReservations: todayReservations.length };
  };

  const stats = getTodayStats();

  return (
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reservations">予約管理</TabsTrigger>
            <TabsTrigger value="customers">顧客管理</TabsTrigger>
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
                      {reservations.map((reservation) => (
                        <tr key={reservation.id} className="border-b">
                          <td className="p-4">{reservation.date}</td>
                          <td className="p-4">{reservation.tripNumber}便</td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{reservation.customerName}</div>
                              <div className="text-sm text-gray-600">
                                <Phone className="inline h-3 w-3 mr-1" />
                                {reservation.phone}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{reservation.peopleCount}名</td>
                          <td className="p-4">¥{reservation.amount.toLocaleString()}</td>
                          <td className="p-4">{getStatusBadge(reservation.status)}</td>
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
                      ))}
                    </tbody>
                  </table>
                </div>
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
                      {customers.map((customer) => (
                        <tr key={customer.id} className="border-b">
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-gray-600">{customer.nameKana}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <div className="flex items-center gap-1 mb-1">
                                <Phone className="h-3 w-3" />
                                {customer.phone}
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {customer.email}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary">{customer.visitCount}回</Badge>
                          </td>
                          <td className="p-4">{customer.lastVisit}</td>
                          <td className="p-4">¥{customer.totalAmount.toLocaleString()}</td>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}