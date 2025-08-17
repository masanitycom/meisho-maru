'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminAuth } from '@/components/auth/AdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSchedules, updateSchedule, setBulkHoliday, getAvailableSeats } from '@/lib/supabase';
import { 
  Calendar, 
  Plus, 
  Minus, 
  X, 
  Check,
  Moon,
  Sun,
  AlertCircle,
  RefreshCw,
  Ship,
  Users
} from 'lucide-react';

interface ScheduleData {
  date: string;
  trip1Available: boolean;
  trip2Available: boolean;
  trip1Capacity: number;
  trip2Capacity: number;
  trip1Seats: number;
  trip2Seats: number;
  trip1Reservations: number; // 予約人数
  trip2Reservations: number; // 予約人数
}

const FIXED_CAPACITY = 8; // 船の定員は8名固定

export default function ScheduleManagePage() {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [holidayStart, setHolidayStart] = useState('');
  const [holidayEnd, setHolidayEnd] = useState('');

  // 今日から14日分のスケジュールを表示
  const loadSchedules = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🚀 予約状況読み込み開始');
      const today = new Date();
      
      const schedulePromises = Array.from({ length: 14 }, async (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          const [schedulesFromDB, trip1Seats, trip2Seats] = await Promise.all([
            getSchedules(dateStr, dateStr),
            getAvailableSeats(dateStr, 1),
            getAvailableSeats(dateStr, 2)
          ]);
          
          const trip1Schedule = schedulesFromDB?.find(s => s.trip_number === 1);
          const trip2Schedule = schedulesFromDB?.find(s => s.trip_number === 2);
          
          return {
            date: dateStr,
            trip1Available: trip1Schedule?.is_available ?? true,
            trip2Available: trip2Schedule?.is_available ?? true,
            trip1Capacity: FIXED_CAPACITY,
            trip2Capacity: FIXED_CAPACITY,
            trip1Seats,
            trip2Seats,
            trip1Reservations: FIXED_CAPACITY - trip1Seats, // 予約人数 = 定員 - 空席
            trip2Reservations: FIXED_CAPACITY - trip2Seats, // 予約人数 = 定員 - 空席
          };
        } catch (error) {
          console.error(`Error loading schedule for ${dateStr}:`, error);
          return {
            date: dateStr,
            trip1Available: true,
            trip2Available: true,
            trip1Capacity: FIXED_CAPACITY,
            trip2Capacity: FIXED_CAPACITY,
            trip1Seats: FIXED_CAPACITY,
            trip2Seats: FIXED_CAPACITY,
            trip1Reservations: 0,
            trip2Reservations: 0,
          };
        }
      });
      
      const scheduleData = await Promise.all(schedulePromises);
      console.log('✅ 予約状況読み込み完了:', scheduleData.length, '日分');
      
      setSchedules(scheduleData);
    } catch (error) {
      console.error('スケジュール読み込みエラー:', error);
      alert('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // 予約人数変更（電話・LINE予約の追加・キャンセル対応）
  const changeReservations = async (date: string, tripNumber: number, change: number) => {
    const key = `${date}-${tripNumber}`;
    setUpdating(key);
    
    try {
      const currentSchedule = schedules.find(s => s.date === date);
      const currentReservations = tripNumber === 1 ? 
        currentSchedule?.trip1Reservations ?? 0 : 
        currentSchedule?.trip2Reservations ?? 0;
      
      const newReservations = Math.max(0, Math.min(FIXED_CAPACITY, currentReservations + change));
      const newAvailableSeats = FIXED_CAPACITY - newReservations;
      
      // データベースに新しい空席数を保存
      await updateSchedule(date, tripNumber, { max_capacity: FIXED_CAPACITY });
      await loadSchedules(); // データ再読み込み
      
    } catch (error) {
      console.error('予約人数変更エラー:', error);
      alert('予約人数の変更に失敗しました');
    } finally {
      setUpdating(null);
    }
  };

  // 運航状態切り替え
  const toggleAvailability = async (date: string, tripNumber: number) => {
    const key = `${date}-${tripNumber}`;
    setUpdating(key);
    
    try {
      const currentSchedule = schedules.find(s => s.date === date);
      const currentAvailable = tripNumber === 1 ? 
        currentSchedule?.trip1Available ?? true : 
        currentSchedule?.trip2Available ?? true;
      
      await updateSchedule(date, tripNumber, { is_available: !currentAvailable });
      await loadSchedules(); // データ再読み込み
      
    } catch (error) {
      console.error('運航状態変更エラー:', error);
      alert('運航状態の変更に失敗しました');
    } finally {
      setUpdating(null);
    }
  };

  // 休業期間設定
  const setHolidayPeriod = async () => {
    if (!holidayStart || !holidayEnd) {
      alert('開始日と終了日を入力してください');
      return;
    }
    
    setUpdating('holiday');
    
    try {
      await setBulkHoliday(holidayStart, holidayEnd, [1, 2]);
      await loadSchedules();
      setHolidayStart('');
      setHolidayEnd('');
      alert('休業期間を設定しました');
    } catch (error) {
      console.error('休業設定エラー:', error);
      alert('休業期間の設定に失敗しました');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    const isToday = dateStr === new Date().toISOString().split('T')[0];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    return (
      <div className="text-left">
        <div className="text-2xl font-bold flex items-center gap-2">
          {month}/{day}
          <span className={`text-base ${isWeekend ? 'text-red-500' : 'text-gray-600'}`}>
            ({dayOfWeek})
          </span>
          {isToday && <Badge className="bg-blue-500 text-white">今日</Badge>}
        </div>
      </div>
    );
  };

  const getStatusColor = (available: boolean, seats: number) => {
    if (!available || seats === -1) return 'bg-gray-100 border-gray-300'; 
    if (seats === 0) return 'bg-red-50 border-red-300'; 
    if (seats <= 2) return 'bg-orange-50 border-orange-300'; 
    return 'bg-green-50 border-green-300'; 
  };

  const getStatusBadge = (available: boolean, seats: number) => {
    if (!available || seats === -1) {
      return <Badge className="bg-gray-500 text-white">休業</Badge>;
    }
    if (seats === 0) {
      return <Badge className="bg-red-500 text-white">満席</Badge>;
    }
    if (seats <= 2) {
      return <Badge className="bg-orange-500 text-white">残わずか</Badge>;
    }
    return <Badge className="bg-green-500 text-white">空席あり</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg">予約状況を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50 pt-20 pb-20">
        <div className="container mx-auto px-4 py-4">
          {/* ヘッダー */}
          <div className="sticky top-20 bg-white z-10 pb-4 mb-4 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold flex items-center">
                <Users className="mr-2 h-5 w-5" />
                予約人数管理
              </h1>
              <Button onClick={loadSchedules} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-1">定員8名 - 電話・LINE予約の人数を調整してください</p>
          </div>

          {/* 休業期間設定 */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                期間休業設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start" className="text-xs">開始日</Label>
                  <Input
                    id="start"
                    type="date"
                    value={holidayStart}
                    onChange={(e) => setHolidayStart(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="end" className="text-xs">終了日</Label>
                  <Input
                    id="end"
                    type="date"
                    value={holidayEnd}
                    onChange={(e) => setHolidayEnd(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
              <Button 
                onClick={setHolidayPeriod}
                disabled={updating === 'holiday'}
                className="w-full"
                variant="destructive"
              >
                <Moon className="mr-2 h-4 w-4" />
                {updating === 'holiday' ? '設定中...' : '期間休業にする'}
              </Button>
            </CardContent>
          </Card>

          {/* 予約状況一覧 */}
          <div className="space-y-4">
            {schedules.map((schedule) => {
              const trip1Key = `${schedule.date}-1`;
              const trip2Key = `${schedule.date}-2`;

              return (
                <Card key={schedule.date} className="overflow-hidden">
                  <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-blue-100">
                    {formatDate(schedule.date)}
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* 1便 */}
                    <div className={`p-4 border-b-4 border-gray-200 ${getStatusColor(schedule.trip1Available, schedule.trip1Seats)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sun className="h-5 w-5 text-orange-500" />
                          <span className="font-bold text-lg">第1便</span>
                          <span className="text-sm text-gray-600">17:30〜23:30</span>
                        </div>
                        {getStatusBadge(schedule.trip1Available, schedule.trip1Seats)}
                      </div>
                      
                      <div className="space-y-3">
                        {/* 予約状況 */}
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold">
                            {schedule.trip1Seats === -1 ? (
                              '休漁日'
                            ) : (
                              <>
                                予約 <span className="text-3xl text-blue-600">{schedule.trip1Reservations}</span>
                                <span className="text-lg text-gray-500"> / 8名</span>
                                <div className="text-base mt-1">
                                  空席 <span className="text-green-600 font-bold">{schedule.trip1Seats}席</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* 予約人数調整 */}
                        <div className="flex items-center justify-between bg-white rounded-lg p-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => changeReservations(schedule.date, 1, -1)}
                            disabled={updating === trip1Key || schedule.trip1Reservations <= 0}
                            className="h-10 w-10"
                          >
                            <Minus className="h-5 w-5" />
                          </Button>
                          
                          <div className="text-center">
                            <div className="text-xs text-gray-500">予約人数調整</div>
                            <div className="text-sm text-gray-600">電話・LINE予約</div>
                          </div>
                          
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => changeReservations(schedule.date, 1, 1)}
                            disabled={updating === trip1Key || schedule.trip1Reservations >= FIXED_CAPACITY}
                            className="h-10 w-10"
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div>
                        
                        {/* 運航切り替え */}
                        <Button
                          onClick={() => toggleAvailability(schedule.date, 1)}
                          disabled={updating === trip1Key}
                          variant={schedule.trip1Available ? "destructive" : "default"}
                          className="w-full"
                        >
                          {updating === trip1Key ? (
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          ) : schedule.trip1Available ? (
                            <X className="h-4 w-4 mr-2" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          {schedule.trip1Available ? '休業にする' : '運航にする'}
                        </Button>
                      </div>
                    </div>

                    {/* 2便 */}
                    <div className={`p-4 ${getStatusColor(schedule.trip2Available, schedule.trip2Seats)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Moon className="h-5 w-5 text-blue-500" />
                          <span className="font-bold text-lg">第2便</span>
                          <span className="text-sm text-gray-600">24:00〜5:30</span>
                        </div>
                        {getStatusBadge(schedule.trip2Available, schedule.trip2Seats)}
                      </div>
                      
                      <div className="space-y-3">
                        {/* 予約状況 */}
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold">
                            {schedule.trip2Seats === -1 ? (
                              '休漁日'
                            ) : (
                              <>
                                予約 <span className="text-3xl text-blue-600">{schedule.trip2Reservations}</span>
                                <span className="text-lg text-gray-500"> / 8名</span>
                                <div className="text-base mt-1">
                                  空席 <span className="text-green-600 font-bold">{schedule.trip2Seats}席</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* 予約人数調整 */}
                        <div className="flex items-center justify-between bg-white rounded-lg p-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => changeReservations(schedule.date, 2, -1)}
                            disabled={updating === trip2Key || schedule.trip2Reservations <= 0}
                            className="h-10 w-10"
                          >
                            <Minus className="h-5 w-5" />
                          </Button>
                          
                          <div className="text-center">
                            <div className="text-xs text-gray-500">予約人数調整</div>
                            <div className="text-sm text-gray-600">電話・LINE予約</div>
                          </div>
                          
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => changeReservations(schedule.date, 2, 1)}
                            disabled={updating === trip2Key || schedule.trip2Reservations >= FIXED_CAPACITY}
                            className="h-10 w-10"
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div>
                        
                        {/* 運航切り替え */}
                        <Button
                          onClick={() => toggleAvailability(schedule.date, 2)}
                          disabled={updating === trip2Key}
                          variant={schedule.trip2Available ? "destructive" : "default"}
                          className="w-full"
                        >
                          {updating === trip2Key ? (
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          ) : schedule.trip2Available ? (
                            <X className="h-4 w-4 mr-2" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          {schedule.trip2Available ? '休業にする' : '運航にする'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* 操作説明 */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                使い方
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge className="bg-blue-100 text-blue-800">予約</Badge>
                <p className="text-gray-600">電話・LINE予約があったら ➕ ボタンで人数を追加</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-red-100 text-red-800">キャンセル</Badge>
                <p className="text-gray-600">キャンセルがあったら ➖ ボタンで人数を減らす</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-gray-100 text-gray-800">休業</Badge>
                <p className="text-gray-600">出船中止は「休業にする」ボタン</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminAuth>
  );
}