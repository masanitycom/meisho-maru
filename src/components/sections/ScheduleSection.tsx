'use client';

import { useState, useRef, useEffect } from 'react';
import { getAvailableSeats } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export function ScheduleSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dates, setDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 今日から30日分のデータを生成（実際の空席数取得）
  const generateDates = async () => {
    const dateList = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      
      try {
        const trip1Seats = await getAvailableSeats(dateStr, 1);
        const trip2Seats = await getAvailableSeats(dateStr, 2);
        
        dateList.push({
          date: date,
          dateStr: dateStr,
          trip1Seats: trip1Seats,
          trip2Seats: trip2Seats,
          dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
          isToday: i === 0,
        });
      } catch (error) {
        console.error(`Error fetching seats for ${dateStr}:`, error);
        // エラーの場合はデフォルト値
        dateList.push({
          date: date,
          dateStr: dateStr,
          trip1Seats: 10,
          trip2Seats: 10,
          dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
          isToday: i === 0,
        });
      }
    }
    
    return dateList;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const loadDates = async () => {
      setLoading(true);
      const dateData = await generateDates();
      setDates(dateData);
      setLoading(false);
    };
    
    loadDates();
  }, [mounted]);

  const getStatusIcon = (seats: number) => {
    if (seats === 0) return <XCircle className="h-5 w-5 text-red-500" />;
    if (seats <= 2) return <AlertCircle className="h-5 w-5 text-orange-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const getStatusText = (seats: number) => {
    if (seats === 0) return '満席';
    if (seats <= 2) return `残${seats}席`;
    return '予約可';
  };

  const getStatusColor = (seats: number) => {
    if (seats === 0) return 'text-red-600 bg-red-50';
    if (seats <= 2) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
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
                    className={`flex-shrink-0 w-72 sm:w-80 ${
                      selectedDate === dateInfo.dateStr ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Card 
                      className={`h-full cursor-pointer hover:shadow-lg transition-shadow ${
                        dateInfo.isToday ? 'border-primary border-2' : ''
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
                      <CardContent className="space-y-3">
                        {/* 1便 */}
                        <div className={`rounded-lg p-3 ${getStatusColor(dateInfo.trip1Seats)}`}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-semibold text-lg">1便</div>
                            {getStatusIcon(dateInfo.trip1Seats)}
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>出港時間</span>
                              <span className="font-medium">17:30過ぎ</span>
                            </div>
                            <div className="flex justify-between">
                              <span>帰港時間</span>
                              <span className="font-medium">23:30頃</span>
                            </div>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t">
                              <span className="font-bold text-base">
                                {getStatusText(dateInfo.trip1Seats)}
                              </span>
                              {dateInfo.trip1Seats > 0 && (
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/reservation?date=${dateInfo.dateStr}&trip=1`}>
                                    予約する
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 2便 */}
                        <div className={`rounded-lg p-3 ${getStatusColor(dateInfo.trip2Seats)}`}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-semibold text-lg">2便</div>
                            {getStatusIcon(dateInfo.trip2Seats)}
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>出港時間</span>
                              <span className="font-medium">24:00頃</span>
                            </div>
                            <div className="flex justify-between">
                              <span>帰港時間</span>
                              <span className="font-medium">5:30頃</span>
                            </div>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t">
                              <span className="font-bold text-base">
                                {getStatusText(dateInfo.trip2Seats)}
                              </span>
                              {dateInfo.trip2Seats > 0 && (
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/reservation?date=${dateInfo.dateStr}&trip=2`}>
                                    予約する
                                  </Link>
                                </Button>
                              )}
                            </div>
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