'use client';

import { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';

interface ScheduleData {
  date: string;
  trip1Available: boolean;
  trip2Available: boolean;
  trip1Capacity: number;
  trip2Capacity: number;
  trip1Seats: number;
  trip2Seats: number;
}

export default function ScheduleManagePage() {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [holidayStart, setHolidayStart] = useState('');
  const [holidayEnd, setHolidayEnd] = useState('');

  // 今日から14日分のスケジュールを表示（並列処理で高速化）
  const loadSchedules = async () => {
    setLoading(true);
    try {
      console.log('🚀 運航管理データ読み込み開始');
      const today = new Date();
      
      // 全ての日付のデータを並列で取得
      const schedulePromises = Array.from({ length: 14 }, async (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          // スケジュール取得と空席数取得を並列実行
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
            trip1Capacity: trip1Schedule?.max_capacity ?? 10,
            trip2Capacity: trip2Schedule?.max_capacity ?? 10,
            trip1Seats,
            trip2Seats,
          };
        } catch (error) {
          console.error(`Error loading schedule for ${dateStr}:`, error);
          // エラーの場合はデフォルト値
          return {
            date: dateStr,
            trip1Available: true,
            trip2Available: true,
            trip1Capacity: 10,
            trip2Capacity: 10,
            trip1Seats: 10,
            trip2Seats: 10,
          };
        }
      });
      
      const scheduleData = await Promise.all(schedulePromises);
      console.log('✅ 運航管理データ読み込み完了:', scheduleData.length, '日分');
      
      setSchedules(scheduleData);
    } catch (error) {
      console.error('スケジュール読み込みエラー:', error);
      alert('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  // 定員変更
  const changeCapacity = async (date: string, tripNumber: number, change: number) => {
    const key = `${date}-${tripNumber}`;
    setUpdating(key);
    
    try {
      const currentSchedule = schedules.find(s => s.date === date);
      const currentCapacity = tripNumber === 1 ? 
        currentSchedule?.trip1Capacity ?? 10 : 
        currentSchedule?.trip2Capacity ?? 10;
      
      const newCapacity = Math.max(0, Math.min(20, currentCapacity + change));
      
      await updateSchedule(date, tripNumber, { max_capacity: newCapacity });
      await loadSchedules(); // データ再読み込み
      
    } catch (error) {
      console.error('定員変更エラー:', error);
      alert('定員の変更に失敗しました');
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
      await loadSchedules(); // データ再読み込み
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
    
    return (
      <div className="text-center">
        <div className="text-lg font-bold">
          {month}月{day}日
          {isToday && <Badge className="ml-2 bg-blue-500">今日</Badge>}
        </div>
        <div className="text-sm text-gray-600">{dayOfWeek}曜日</div>
      </div>
    );
  };

  const getStatusColor = (available: boolean, seats: number) => {
    if (!available || seats === -1) return 'bg-gray-100 border-gray-300'; // 休漁日
    if (seats === 0) return 'bg-red-50 border-red-200'; // 満席
    if (seats <= 2) return 'bg-orange-50 border-orange-200'; // 残りわずか
    return 'bg-green-50 border-green-200'; // 空席あり
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">スケジュールを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Calendar className="mr-3 h-8 w-8" />
            運航スケジュール管理
          </h1>
          <Button onClick={loadSchedules} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            更新
          </Button>
        </div>

        {/* 休業期間設定 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Moon className="mr-2 h-5 w-5" />
              休業期間設定
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label htmlFor="start">開始日</Label>
                <Input
                  id="start"
                  type="date"
                  value={holidayStart}
                  onChange={(e) => setHolidayStart(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end">終了日</Label>
                <Input
                  id="end"
                  type="date"
                  value={holidayEnd}
                  onChange={(e) => setHolidayEnd(e.target.value)}
                />
              </div>
              <div>
                <Button 
                  onClick={setHolidayPeriod}
                  disabled={updating === 'holiday'}
                  className="w-full h-10"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  {updating === 'holiday' ? '設定中...' : '休業にする'}
                </Button>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  指定した期間の全便を休業にします
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* スケジュール一覧 */}
        <div className="grid gap-6">
          {schedules.map((schedule) => (
            <Card key={schedule.date}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  {formatDate(schedule.date)}
                  <Badge variant="outline" className="text-sm">
                    全{schedule.trip1Seats + schedule.trip2Seats}席空き
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 1便 */}
                  <div className={`p-4 rounded-lg border-2 ${getStatusColor(schedule.trip1Available, schedule.trip1Seats)}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">1便（17:30〜23:30）</h3>
                      <div className="flex items-center gap-2">
                        {schedule.trip1Available ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Sun className="h-3 w-3 mr-1" />運航中
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            <Moon className="h-3 w-3 mr-1" />休業中
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-2">
                          {schedule.trip1Seats === -1 ? '休漁日' : `空席 ${schedule.trip1Seats}席 / 定員 ${schedule.trip1Capacity}席`}
                        </div>
                        
                        {/* 定員調整ボタン */}
                        <div className="flex justify-center items-center gap-2 mb-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => changeCapacity(schedule.date, 1, -1)}
                            disabled={updating === `${schedule.date}-1` || schedule.trip1Capacity <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-16 text-center font-bold">定員</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => changeCapacity(schedule.date, 1, 1)}
                            disabled={updating === `${schedule.date}-1` || schedule.trip1Capacity >= 20}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* 運航切り替えボタン */}
                        <Button
                          onClick={() => toggleAvailability(schedule.date, 1)}
                          disabled={updating === `${schedule.date}-1`}
                          className={`w-full h-12 text-lg ${
                            schedule.trip1Available 
                              ? 'bg-red-500 hover:bg-red-600' 
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          {updating === `${schedule.date}-1` ? (
                            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                          ) : schedule.trip1Available ? (
                            <X className="h-5 w-5 mr-2" />
                          ) : (
                            <Check className="h-5 w-5 mr-2" />
                          )}
                          {schedule.trip1Available ? '休業にする' : '運航にする'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 2便 */}
                  <div className={`p-4 rounded-lg border-2 ${getStatusColor(schedule.trip2Available, schedule.trip2Seats)}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">2便（24:00〜5:30）</h3>
                      <div className="flex items-center gap-2">
                        {schedule.trip2Available ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Sun className="h-3 w-3 mr-1" />運航中
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            <Moon className="h-3 w-3 mr-1" />休業中
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-2">
                          {schedule.trip2Seats === -1 ? '休漁日' : `空席 ${schedule.trip2Seats}席 / 定員 ${schedule.trip2Capacity}席`}
                        </div>
                        
                        {/* 定員調整ボタン */}
                        <div className="flex justify-center items-center gap-2 mb-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => changeCapacity(schedule.date, 2, -1)}
                            disabled={updating === `${schedule.date}-2` || schedule.trip2Capacity <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-16 text-center font-bold">定員</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => changeCapacity(schedule.date, 2, 1)}
                            disabled={updating === `${schedule.date}-2` || schedule.trip2Capacity >= 20}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* 運航切り替えボタン */}
                        <Button
                          onClick={() => toggleAvailability(schedule.date, 2)}
                          disabled={updating === `${schedule.date}-2`}
                          className={`w-full h-12 text-lg ${
                            schedule.trip2Available 
                              ? 'bg-red-500 hover:bg-red-600' 
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          {updating === `${schedule.date}-2` ? (
                            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                          ) : schedule.trip2Available ? (
                            <X className="h-5 w-5 mr-2" />
                          ) : (
                            <Check className="h-5 w-5 mr-2" />
                          )}
                          {schedule.trip2Available ? '休業にする' : '運航にする'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 操作説明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              操作方法
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-bold mb-2">定員を調整</h4>
                <p className="text-gray-600">➕➖ ボタンで各便の定員数を調整できます（最大20席）</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">運航を止める</h4>
                <p className="text-gray-600">「休業にする」ボタンで出船を中止にできます</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">まとめて休業</h4>
                <p className="text-gray-600">期間を指定して連続で休業日を設定できます</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminAuth>
  );
}