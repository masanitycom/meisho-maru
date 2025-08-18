'use client';

import { useState, useRef, useEffect } from 'react';
import { getAvailableSeats } from '@/lib/supabase';
import { getJSTDate } from '@/lib/date-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface DateInfo {
  date: Date;
  dateStr: string;
  trip1Seats: number;
  trip2Seats: number;
  dayOfWeek: string;
  isToday: boolean;
}

export function ScheduleSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dates, setDates] = useState<DateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 今日から30日分のデータを生成（日本時間基準・並列処理で高速化）
  const generateDates = async (): Promise<DateInfo[]> => {
    console.log('フロントエンド JST今日:', getJSTDate(0).toISOString().split('T')[0]);
    
    // 全ての日付の空席数を並列で取得
    const datePromises = Array.from({ length: 30 }, async (_, i) => {
      const date = getJSTDate(i);
      const dateStr = date.toISOString().split('T')[0];
      
      try {
        // 1便と2便を並列で取得
        const [trip1Seats, trip2Seats] = await Promise.all([
          getAvailableSeats(dateStr, 1),
          getAvailableSeats(dateStr, 2)
        ]);
        
        return {
          date: date,
          dateStr: dateStr,
          trip1Seats: trip1Seats,
          trip2Seats: trip2Seats,
          dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
          isToday: i === 0,
        };
      } catch (error) {
        console.error(`スケジュール取得エラー ${dateStr}:`, error);
        // エラーの場合はデフォルト値（定員8名）
        return {
          date: date,
          dateStr: dateStr,
          trip1Seats: 8,
          trip2Seats: 8,
          dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
          isToday: i === 0,
        };
      }
    });
    
    // 全ての日付のデータを並列で待機
    const dateList = await Promise.all(datePromises);
    
    return dateList;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const loadDates = async () => {
      setLoading(true);
      try {
        const dateData = await generateDates();
        setDates(dateData);
      } catch (error) {
        console.error('カレンダー読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDates();
  }, [mounted]);

  const getStatusIcon = (seats: number) => {
    if (seats === -1) return <XCircle className="h-5 w-5 text-gray-500" />; // 休漁日
    if (seats === 0) return <XCircle className="h-5 w-5 text-red-500" />; // 満席
    if (seats <= 2) return <AlertCircle className="h-5 w-5 text-orange-500" />; // 残りわずか
    return <CheckCircle className="h-5 w-5 text-green-500" />; // 空席あり
  };

  const getStatusText = (seats: number) => {
    if (seats === -1) return '休漁日';
    if (seats === 0) return '満席';
    return `空席${seats}席`;
  };

  const getStatusColor = (seats: number) => {
    if (seats === -1) return 'text-gray-700 bg-gray-200 border-gray-300'; // 休漁日
    if (seats === 0) return 'text-white bg-red-500 border-red-600'; // 満席
    if (seats <= 2) return 'text-white bg-orange-500 border-orange-600'; // 残りわずか
    return 'text-white bg-green-500 border-green-600'; // 空席あり
  };

  const getStatusBadge = (seats: number) => {
    const baseClasses = "inline-flex items-center justify-center px-3 py-2 text-lg font-bold rounded-lg border-2 min-w-[100px]";
    
    if (seats === -1) {
      return (
        <div className={`${baseClasses} ${getStatusColor(seats)}`}>
          <XCircle className="h-5 w-5 mr-2" />
          休漁日
        </div>
      );
    }
    
    if (seats === 0) {
      return (
        <div className={`${baseClasses} ${getStatusColor(seats)}`}>
          <XCircle className="h-5 w-5 mr-2" />
          満席
        </div>
      );
    }
    
    if (seats <= 2) {
      return (
        <div className={`${baseClasses} ${getStatusColor(seats)}`}>
          <AlertCircle className="h-5 w-5 mr-2" />
          残り{seats}席
        </div>
      );
    }
    
    return (
      <div className={`${baseClasses} ${getStatusColor(seats)}`}>
        <CheckCircle className="h-5 w-5 mr-2" />
        空席{seats}席
      </div>
    );
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // カード幅 + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="schedule" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">運航スケジュール</h2>
          <p className="text-xl text-gray-600">
            ご希望の日程をお選びください
          </p>
        </div>

        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl flex items-center justify-between">
              <span>予約状況</span>
              <div className="flex gap-2 text-sm font-normal">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  空席あり
                </span>
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  残りわずか
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-red-500" />
                  満席
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-gray-500" />
                  休漁日
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="relative">
              {/* 左スクロールボタン */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors hidden sm:block"
                aria-label="前へ"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* 右スクロールボタン */}
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors hidden sm:block"
                aria-label="次へ"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* カードスクロールエリア */}
              <div 
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 px-1 sm:px-10 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {!mounted || loading ? (
                  Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="flex-shrink-0 w-72 sm:w-80 h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                  ))
                ) : dates.map((dateInfo) => (
                  <div
                    key={dateInfo.dateStr}
                    className={`flex-shrink-0 w-80 sm:w-96 ${
                      selectedDate === dateInfo.dateStr ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Card 
                      className={`cursor-pointer hover:shadow-xl transition-all duration-200 min-h-[500px] ${
                        dateInfo.isToday ? 'border-blue-500 border-3 shadow-lg' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedDate(dateInfo.dateStr)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-2xl font-bold">
                              {dateInfo.date.getMonth() + 1}月{dateInfo.date.getDate()}日
                            </div>
                            <div className="text-sm text-gray-600">
                              {dateInfo.dayOfWeek}曜日
                              {dateInfo.isToday && (
                                <span className="ml-2 text-primary font-semibold">本日</span>
                              )}
                            </div>
                          </div>
                          <Calendar className="h-6 w-6 text-gray-400" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* 1便 */}
                        <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-center mb-3">
                            <div className="font-bold text-xl text-gray-800">1便</div>
                            <div className="text-sm text-gray-600">
                              17:30〜23:30
                            </div>
                          </div>
                          
                          {/* 空席数バッジ（大きく目立つ） */}
                          <div className="flex justify-center mb-4">
                            {getStatusBadge(dateInfo.trip1Seats)}
                          </div>
                          
                          {/* 予約ボタン */}
                          <div className="text-center">
                            {dateInfo.trip1Seats > 0 ? (
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2" asChild>
                                <Link href={`/reservation?date=${dateInfo.dateStr}&trip=1`}>
                                  この便を予約する
                                </Link>
                              </Button>
                            ) : dateInfo.trip1Seats === 0 ? (
                              <Button disabled className="w-full bg-gray-300 text-gray-500 py-2">
                                満席のため予約不可
                              </Button>
                            ) : (
                              <Button disabled className="w-full bg-gray-300 text-gray-500 py-2">
                                運航なし
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* 2便 */}
                        <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-center mb-3">
                            <div className="font-bold text-xl text-gray-800">2便</div>
                            <div className="text-sm text-gray-600">
                              24:00〜5:30
                            </div>
                          </div>
                          
                          {/* 空席数バッジ（大きく目立つ） */}
                          <div className="flex justify-center mb-4">
                            {getStatusBadge(dateInfo.trip2Seats)}
                          </div>
                          
                          {/* 予約ボタン */}
                          <div className="text-center">
                            {dateInfo.trip2Seats > 0 ? (
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2" asChild>
                                <Link href={`/reservation?date=${dateInfo.dateStr}&trip=2`}>
                                  この便を予約する
                                </Link>
                              </Button>
                            ) : dateInfo.trip2Seats === 0 ? (
                              <Button disabled className="w-full bg-gray-300 text-gray-500 py-2">
                                満席のため予約不可
                              </Button>
                            ) : (
                              <Button disabled className="w-full bg-gray-300 text-gray-500 py-2">
                                運航なし
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button size="lg" className="inline-flex items-center" asChild>
                <Link href="/reservation" className="inline-flex items-center">
                  <Calendar className="mr-2 h-5 w-5 flex-shrink-0" />
                  <span>予約画面へ進む</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                1便
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">17:30 〜 23:30</p>
              <p className="text-gray-600">
                夕方から夜にかけての出船。
                日没後の活性が高い時間帯での釣りが楽しめます。
              </p>
              <p className="text-sm text-orange-600 mt-2">
                ※17:30過ぎに出船、23:30頃帰港
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                2便
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">24:00 〜 5:30</p>
              <p className="text-gray-600">
                深夜から早朝にかけての出船。
                静かな海で集中して釣りを楽しめます。
              </p>
              <p className="text-sm text-orange-600 mt-2">
                ※24:00頃出航、5:30頃帰港
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ※季節、天候により変更になる場合がありますのでご了承下さい。
          </p>
        </div>
      </div>
    </section>
  );
}