'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminAuth } from '@/components/auth/AdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateSchedule, setBulkHoliday, getAvailableSeats } from '@/lib/supabase-admin';
import { createManualReservation, deleteLastManualReservation } from '@/lib/reservation-admin';
import { getJSTDate, isJSTToday } from '@/lib/date-utils';
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
  Users,
  Save
} from 'lucide-react';

interface ScheduleData {
  date: string;
  trip1Available: boolean;
  trip2Available: boolean;
  trip1Capacity: number;
  trip2Capacity: number;
  trip1Seats: number;
  trip2Seats: number;
  trip1Reservations: number;
  trip2Reservations: number;
}

interface LocalChanges {
  [key: string]: number; // key format: "date-tripNumber", value: change amount
}

const FIXED_CAPACITY = 8; // 船の定員は8名固定

export default function ScheduleManagePage() {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [localChanges, setLocalChanges] = useState<LocalChanges>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [holidayStart, setHolidayStart] = useState('');
  const [holidayEnd, setHolidayEnd] = useState('');

  // 今日から30日分のスケジュールを表示（日本時間基準）
  const loadSchedules = useCallback(async (clearLocal = false) => {
    setLoading(true);
    try {
      console.log('🚀 予約状況読み込み開始');
      
      const schedulePromises = Array.from({ length: 30 }, async (_, i) => {
        const date = getJSTDate(i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          const [trip1Seats, trip2Seats] = await Promise.all([
            getAvailableSeats(dateStr, 1),
            getAvailableSeats(dateStr, 2)
          ]);
          
          return {
            date: dateStr,
            trip1Available: true,
            trip2Available: true,
            trip1Capacity: FIXED_CAPACITY,
            trip2Capacity: FIXED_CAPACITY,
            trip1Seats,
            trip2Seats,
            trip1Reservations: FIXED_CAPACITY - trip1Seats,
            trip2Reservations: FIXED_CAPACITY - trip2Seats,
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
      console.log('JST今日の日付:', getJSTDate(0).toISOString().split('T')[0]);
      
      setSchedules(scheduleData);
      if (clearLocal) {
        setLocalChanges({});
        setHasChanges(false);
      }
    } catch (error) {
      console.error('スケジュール読み込みエラー:', error);
      alert('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedules(true);
  }, [loadSchedules]);

  // ローカルで予約人数変更（リアルタイム更新）
  const changeReservationsLocal = (date: string, tripNumber: number, change: number) => {
    const key = `${date}-${tripNumber}`;
    const currentSchedule = schedules.find(s => s.date === date);
    if (!currentSchedule) return;
    
    const currentReservations = tripNumber === 1 ? 
      currentSchedule.trip1Reservations : 
      currentSchedule.trip2Reservations;
    
    // ローカル変更を含む現在の値
    const currentWithLocal = currentReservations + (localChanges[key] || 0);
    const newValue = currentWithLocal + change;
    
    // 0〜8の範囲でのみ変更可能
    if (newValue < 0 || newValue > FIXED_CAPACITY) return;
    
    // ローカル変更を更新
    const newLocalChanges = { ...localChanges };
    const totalChange = (localChanges[key] || 0) + change;
    
    if (totalChange === 0) {
      delete newLocalChanges[key];
    } else {
      newLocalChanges[key] = totalChange;
    }
    
    setLocalChanges(newLocalChanges);
    setHasChanges(Object.keys(newLocalChanges).length > 0);
  };

  // 変更を保存
  const saveChanges = async () => {
    setSaving(true);
    
    try {
      // すべての変更を順次適用
      for (const [key, changeAmount] of Object.entries(localChanges)) {
        console.log('Processing key:', key, 'changeAmount:', changeAmount);
        
        // キーのフォーマット: "YYYY-MM-DD-tripNumber"
        const keyParts = key.split('-');
        const tripNumber = parseInt(keyParts[keyParts.length - 1]); // 最後の部分がtripNumber
        const date = keyParts.slice(0, -1).join('-'); // 最後以外を結合してdate
        
        console.log('Parsed date:', date, 'tripNumber:', tripNumber);
        
        if (changeAmount > 0) {
          // 予約追加
          for (let i = 0; i < changeAmount; i++) {
            await createManualReservation(date, tripNumber, 1);
          }
        } else if (changeAmount < 0) {
          // 予約削除
          for (let i = 0; i < Math.abs(changeAmount); i++) {
            await deleteLastManualReservation(date, tripNumber);
          }
        }
      }
      
      // データ再読み込みとローカル状態クリア
      await loadSchedules(true);
      
      // 公開ページのキャッシュをクリア
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: '/' })
        });
      } catch (error) {
        console.error('キャッシュクリアエラー:', error);
      }
      
      alert('変更を保存しました');
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  // 変更をキャンセル
  const cancelChanges = () => {
    setLocalChanges({});
    setHasChanges(false);
  };

  // 表示用の予約人数を計算
  const getDisplayReservations = (schedule: ScheduleData, tripNumber: number) => {
    const key = `${schedule.date}-${tripNumber}`;
    const baseReservations = tripNumber === 1 ? 
      schedule.trip1Reservations : 
      schedule.trip2Reservations;
    return baseReservations + (localChanges[key] || 0);
  };

  // 表示用の空席数を計算
  const getDisplaySeats = (schedule: ScheduleData, tripNumber: number) => {
    const reservations = getDisplayReservations(schedule, tripNumber);
    return FIXED_CAPACITY - reservations;
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
    
    const isToday = isJSTToday(dateStr);
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
            <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
              <h1 className="text-lg md:text-xl font-bold flex items-center">
                <Users className="mr-2 h-5 w-5" />
                予約人数管理
              </h1>
              <div className="flex gap-2 justify-end">
                {hasChanges && (
                  <>
                    <Button 
                      onClick={cancelChanges} 
                      variant="outline" 
                      size="sm"
                      disabled={saving}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4 md:mr-1" />
                      <span className="hidden md:inline">取消</span>
                    </Button>
                    <Button 
                      onClick={saveChanges} 
                      variant="default" 
                      size="sm"
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700 flex-shrink-0"
                    >
                      {saving ? (
                        <RefreshCw className="h-4 w-4 md:mr-1 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 md:mr-1" />
                      )}
                      <span className="hidden md:inline">保存</span>
                    </Button>
                  </>
                )}
                <Button onClick={() => loadSchedules(true)} variant="outline" size="sm" className="flex-shrink-0">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mt-1">定員8名 - 電話・LINE予約の人数を調整してください</p>
            {hasChanges && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
                <p className="text-sm text-orange-800 font-bold flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  変更があります。保存ボタンを押してください。
                </p>
              </div>
            )}
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
                    <div className={`p-4 border-b-4 border-gray-200 ${getStatusColor(schedule.trip1Available, getDisplaySeats(schedule, 1))}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sun className="h-5 w-5 text-orange-500" />
                          <span className="font-bold text-lg">第1便</span>
                          <span className="text-sm text-gray-600">17:30〜23:30</span>
                        </div>
                        {getStatusBadge(schedule.trip1Available, getDisplaySeats(schedule, 1))}
                      </div>
                      
                      <div className="space-y-3">
                        {/* 予約状況 */}
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold">
                            {schedule.trip1Seats === -1 ? (
                              '休漁日'
                            ) : (
                              <>
                                予約 <span className={`text-3xl ${localChanges[trip1Key] ? 'text-orange-600' : 'text-blue-600'}`}>
                                  {getDisplayReservations(schedule, 1)}
                                </span>
                                <span className="text-lg text-gray-500"> / 8名</span>
                                <div className="text-base mt-1">
                                  空席 <span className={`font-bold ${localChanges[trip1Key] ? 'text-orange-600' : 'text-green-600'}`}>
                                    {getDisplaySeats(schedule, 1)}席
                                  </span>
                                </div>
                                {localChanges[trip1Key] && (
                                  <div className="text-xs text-orange-600 mt-1">
                                    (変更: {localChanges[trip1Key] > 0 ? '+' : ''}{localChanges[trip1Key]})
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* 予約人数調整 */}
                        <div className="flex items-center justify-between bg-white rounded-lg p-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => changeReservationsLocal(schedule.date, 1, -1)}
                            disabled={getDisplayReservations(schedule, 1) <= 0}
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
                            onClick={() => changeReservationsLocal(schedule.date, 1, 1)}
                            disabled={getDisplayReservations(schedule, 1) >= FIXED_CAPACITY}
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
                    <div className={`p-4 ${getStatusColor(schedule.trip2Available, getDisplaySeats(schedule, 2))}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Moon className="h-5 w-5 text-blue-500" />
                          <span className="font-bold text-lg">第2便</span>
                          <span className="text-sm text-gray-600">24:00〜5:30</span>
                        </div>
                        {getStatusBadge(schedule.trip2Available, getDisplaySeats(schedule, 2))}
                      </div>
                      
                      <div className="space-y-3">
                        {/* 予約状況 */}
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold">
                            {schedule.trip2Seats === -1 ? (
                              '休漁日'
                            ) : (
                              <>
                                予約 <span className={`text-3xl ${localChanges[trip2Key] ? 'text-orange-600' : 'text-blue-600'}`}>
                                  {getDisplayReservations(schedule, 2)}
                                </span>
                                <span className="text-lg text-gray-500"> / 8名</span>
                                <div className="text-base mt-1">
                                  空席 <span className={`font-bold ${localChanges[trip2Key] ? 'text-orange-600' : 'text-green-600'}`}>
                                    {getDisplaySeats(schedule, 2)}席
                                  </span>
                                </div>
                                {localChanges[trip2Key] && (
                                  <div className="text-xs text-orange-600 mt-1">
                                    (変更: {localChanges[trip2Key] > 0 ? '+' : ''}{localChanges[trip2Key]})
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* 予約人数調整 */}
                        <div className="flex items-center justify-between bg-white rounded-lg p-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => changeReservationsLocal(schedule.date, 2, -1)}
                            disabled={getDisplayReservations(schedule, 2) <= 0}
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
                            onClick={() => changeReservationsLocal(schedule.date, 2, 1)}
                            disabled={getDisplayReservations(schedule, 2) >= FIXED_CAPACITY}
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

        {/* スマホ用固定保存バー */}
        {hasChanges && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50 md:hidden">
            <div className="flex gap-3 max-w-sm mx-auto">
              <Button 
                onClick={cancelChanges} 
                variant="outline" 
                className="flex-1"
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
              <Button 
                onClick={saveChanges} 
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={saving}
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                保存
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminAuth>
  );
}