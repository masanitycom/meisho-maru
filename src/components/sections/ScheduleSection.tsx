'use client';

import { useState, useEffect } from 'react';
import { getAvailableSeats } from '@/lib/supabase';
import { getJSTDate } from '@/lib/date-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, XCircle, Anchor } from 'lucide-react';
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dates, setDates] = useState<DateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  useEffect(() => {
    setMounted(true);
  }, []);

  // 月間データを生成
  const generateMonthDates = async (year: number, month: number): Promise<DateInfo[]> => {
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const today = getJSTDate(0);
    
    const datePromises = Array.from({ length: daysInMonth }, async (_, i) => {
      const date = new Date(year, month, i + 1);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
      
      try {
        const [trip1Seats, trip2Seats] = await Promise.all([
          getAvailableSeats(dateStr, 1),
          getAvailableSeats(dateStr, 2)
        ]);
        
        return {
          date,
          dateStr,
          trip1Seats,
          trip2Seats,
          dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
          isToday: date.toDateString() === today.toDateString(),
        };
      } catch (error) {
        console.error(`Error fetching seats for ${dateStr}:`, error);
        return {
          date,
          dateStr,
          trip1Seats: -1,
          trip2Seats: -1,
          dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
          isToday: date.toDateString() === today.toDateString(),
        };
      }
    });

    return Promise.all(datePromises);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const monthDates = await generateMonthDates(year, month);
      setDates(monthDates);
      setLoading(false);
    };

    if (mounted) {
      loadData();
    }
  }, [currentMonth, mounted]);

  const getStatusColor = (seats: number) => {
    if (seats === -1) return 'text-gray-400';
    if (seats === 0) return 'text-red-500';
    if (seats <= 2) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStatusIcon = (seats: number) => {
    if (seats === -1) return <XCircle className="h-4 w-4" />;
    if (seats === 0) return <XCircle className="h-4 w-4" />;
    if (seats <= 2) return <AlertCircle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = (seats: number, isMobile: boolean = false) => {
    if (seats === -1) return '休';
    if (seats === 0) return '満';
    if (seats <= 2) return `${seats}`;
    return '○';
  };

  const getStatusEmoji = (seats: number) => {
    if (seats === -1) return '⚫';
    if (seats === 0) return '🔴';
    if (seats <= 2) return '🟡';
    return '🟢';
  };

  const getStatusDot = (seats: number) => {
    if (seats === -1) return 'bg-gray-400';
    if (seats === 0) return 'bg-red-500';
    if (seats <= 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // カレンダーグリッド用の日付配列を生成
  const getCalendarGrid = (): (DateInfo | null)[] => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const startDay = firstDay.getDay();
    const grid: (DateInfo | null)[] = [];
    
    // 前月の空白
    for (let i = 0; i < startDay; i++) {
      grid.push(null);
    }
    
    // 当月の日付
    dates.forEach(date => {
      grid.push(date);
    });
    
    return grid;
  };

  const calendarGrid = getCalendarGrid();

  return (
    <section id="schedule" className="py-20 bg-gradient-to-b from-blue-50 to-cyan-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">運航スケジュール</h2>
          <p className="text-xl text-gray-600">
            ご希望の日程をお選びください
          </p>
        </div>

        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <CardTitle className="text-xl sm:text-2xl flex items-center">
                <Calendar className="mr-2 h-6 w-6 text-primary" />
                予約状況
              </CardTitle>
              
              {/* ビュー切り替えボタン */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'calendar' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  カレンダー
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  リスト
                </button>
              </div>
            </div>
            
            {/* 凡例 */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-gray-700">空席あり</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="text-gray-700">残りわずか</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-gray-700">満席</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                <span className="text-gray-700">休漁日</span>
              </span>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* 月切り替え */}
            <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <button
                onClick={() => changeMonth('prev')}
                className="p-2 sm:p-3 rounded-full bg-white hover:bg-blue-50 transition-colors shadow-md"
                aria-label="前月"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </button>
              
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm">
                {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
              </h3>
              
              <button
                onClick={() => changeMonth('next')}
                className="p-2 sm:p-3 rounded-full bg-white hover:bg-blue-50 transition-colors shadow-md"
                aria-label="翌月"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">読み込み中...</p>
              </div>
            ) : viewMode === 'calendar' ? (
              /* カレンダービュー */
              <div>
                {/* 曜日ヘッダー */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                  {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                    <div 
                      key={day} 
                      className={`text-center text-sm sm:text-base lg:text-lg font-bold p-2 rounded-lg ${
                        index === 0 ? 'text-red-600 bg-red-50' : 
                        index === 6 ? 'text-blue-600 bg-blue-50' : 
                        'text-gray-700 bg-gray-50'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* カレンダーグリッド */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {calendarGrid.map((dateInfo, index) => (
                    <div key={index} className="aspect-square">
                      {dateInfo ? (
                        <button
                          onClick={() => setSelectedDate(dateInfo.dateStr)}
                          className={`w-full h-full p-1 sm:p-2 border rounded-lg transition-all hover:shadow-md relative ${
                            dateInfo.isToday 
                              ? 'border-blue-500 bg-blue-50' 
                              : selectedDate === dateInfo.dateStr
                              ? 'border-blue-400 bg-blue-100'
                              : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="h-full flex flex-col">
                            {/* 日付 - PC版では大きく表示 */}
                            <div className={`font-medium text-sm sm:text-base md:text-lg mb-1 ${
                              dateInfo.date.getDay() === 0 ? 'text-red-600' : 
                              dateInfo.date.getDay() === 6 ? 'text-blue-600' : 
                              'text-gray-900'
                            }`}>
                              {dateInfo.date.getDate()}
                            </div>
                            
                            {/* PC版: テキスト表示 */}
                            <div className="hidden md:flex flex-col space-y-1 text-xs">
                              {/* 1便 */}
                              <div className="flex items-center justify-between px-1">
                                <span className="text-gray-600">1便</span>
                                {dateInfo.trip1Seats === -1 ? (
                                  <span className="text-gray-400">休</span>
                                ) : dateInfo.trip1Seats === 0 ? (
                                  <span className="text-red-600 font-bold">満</span>
                                ) : (
                                  <span className={`font-bold ${dateInfo.trip1Seats <= 2 ? 'text-orange-600' : 'text-green-600'}`}>
                                    {dateInfo.trip1Seats}席
                                  </span>
                                )}
                              </div>
                              
                              {/* 2便 */}
                              <div className="flex items-center justify-between px-1">
                                <span className="text-gray-600">2便</span>
                                {dateInfo.trip2Seats === -1 ? (
                                  <span className="text-gray-400">休</span>
                                ) : dateInfo.trip2Seats === 0 ? (
                                  <span className="text-red-600 font-bold">満</span>
                                ) : (
                                  <span className={`font-bold ${dateInfo.trip2Seats <= 2 ? 'text-orange-600' : 'text-green-600'}`}>
                                    {dateInfo.trip2Seats}席
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* モバイル版: ドット表示 */}
                            <div className="md:hidden flex justify-center gap-2 mt-auto">
                              <div className={`w-2 h-2 rounded-full ${getStatusDot(dateInfo.trip1Seats)}`} 
                                   title={`1便: ${dateInfo.trip1Seats === -1 ? '休漁日' : dateInfo.trip1Seats === 0 ? '満席' : `${dateInfo.trip1Seats}席`}`}></div>
                              <div className={`w-2 h-2 rounded-full ${getStatusDot(dateInfo.trip2Seats)}`}
                                   title={`2便: ${dateInfo.trip2Seats === -1 ? '休漁日' : dateInfo.trip2Seats === 0 ? '満席' : `${dateInfo.trip2Seats}席`}`}></div>
                            </div>
                          </div>
                        </button>
                      ) : (
                        <div className="w-full h-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* リストビュー */
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {dates.map((dateInfo) => (
                  <div
                    key={dateInfo.dateStr}
                    className={`border rounded-lg p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer ${
                      dateInfo.isToday 
                        ? 'border-blue-500 bg-blue-50' 
                        : selectedDate === dateInfo.dateStr
                        ? 'border-blue-400 bg-blue-100'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDate(dateInfo.dateStr)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${
                            dateInfo.date.getDay() === 0 ? 'text-red-600' : 
                            dateInfo.date.getDay() === 6 ? 'text-blue-600' : 
                            'text-gray-900'
                          }`}>
                            {dateInfo.date.getDate()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {dateInfo.dayOfWeek}
                          </div>
                        </div>
                        <div className="border-l pl-3">
                          <div className="text-sm text-gray-600">
                            {dateInfo.date.getMonth() + 1}月
                          </div>
                          {dateInfo.isToday && (
                            <span className="text-xs font-semibold text-blue-600">本日</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        {/* 1便 */}
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">1便</div>
                          <div className="font-bold">
                            {dateInfo.trip1Seats === -1 ? (
                              <span className="text-gray-400">休</span>
                            ) : dateInfo.trip1Seats === 0 ? (
                              <span className="text-red-600">満席</span>
                            ) : (
                              <span className={dateInfo.trip1Seats <= 2 ? 'text-orange-600' : 'text-green-600'}>
                                {dateInfo.trip1Seats}席
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* 2便 */}
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">2便</div>
                          <div className="font-bold">
                            {dateInfo.trip2Seats === -1 ? (
                              <span className="text-gray-400">休</span>
                            ) : dateInfo.trip2Seats === 0 ? (
                              <span className="text-red-600">満席</span>
                            ) : (
                              <span className={dateInfo.trip2Seats <= 2 ? 'text-orange-600' : 'text-green-600'}>
                                {dateInfo.trip2Seats}席
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* 選択された日付の詳細 */}
            {selectedDate && !loading && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                {(() => {
                  const selected = dates.find(d => d.dateStr === selectedDate);
                  if (!selected) return null;
                  
                  return (
                    <div>
                      <h4 className="font-bold text-lg mb-3">
                        {selected.date.getMonth() + 1}月{selected.date.getDate()}日({selected.dayOfWeek})の予約
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold">1便</span>
                            <span className="text-sm text-gray-600">17:30〜23:30</span>
                          </div>
                          {selected.trip1Seats > 0 ? (
                            <Link
                              href={`/reservation?date=${selectedDate}&trip=1`}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-md inline-block transition-colors"
                            >
                              予約する（残{selected.trip1Seats}席）
                            </Link>
                          ) : selected.trip1Seats === 0 ? (
                            <div className="text-center py-2 text-red-500">満席</div>
                          ) : (
                            <div className="text-center py-2 text-gray-500">休漁日</div>
                          )}
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold">2便</span>
                            <span className="text-sm text-gray-600">24:00〜5:30</span>
                          </div>
                          {selected.trip2Seats > 0 ? (
                            <Link
                              href={`/reservation?date=${selectedDate}&trip=2`}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-md inline-block transition-colors"
                            >
                              予約する（残{selected.trip2Seats}席）
                            </Link>
                          ) : selected.trip2Seats === 0 ? (
                            <div className="text-center py-2 text-red-500">満席</div>
                          ) : (
                            <div className="text-center py-2 text-gray-500">休漁日</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            
            <div className="mt-8 flex justify-center">
              <Link
                href="/reservation"
                className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center justify-center rounded-md px-6 py-3 h-12 font-medium transition-colors"
              >
                <Calendar className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>予約画面へ進む</span>
              </Link>
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
                <Anchor className="mr-2 h-5 w-5 text-primary" />
                2便
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">24:00 〜 5:30</p>
              <p className="text-gray-600">
                深夜から早朝にかけての出船。
                静かな夜の海で集中して釣りを楽しめます。
              </p>
              <p className="text-sm text-orange-600 mt-2">
                ※24:00頃出船、5:30頃帰港
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}