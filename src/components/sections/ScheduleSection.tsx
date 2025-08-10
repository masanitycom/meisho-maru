'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export function ScheduleSection() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const isToday = 
        date.toDateString() === new Date().toDateString();
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

      days.push(
        <div
          key={day}
          className={`border rounded-lg p-1 sm:p-2 min-h-[60px] sm:h-24 ${
            isPast ? 'bg-gray-100 opacity-50' : 'hover:bg-blue-50 cursor-pointer'
          } ${isToday ? 'ring-2 ring-primary' : ''}`}
        >
          <div className="font-semibold text-xs sm:text-sm mb-1">{day}</div>
          {!isPast && (
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-[10px] sm:text-xs text-green-600">午前○</div>
              <div className="text-[10px] sm:text-xs text-green-600">午後○</div>
            </div>
          )}
        </div>
      );
    }

    return days;
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
          <CardHeader className="px-3 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <CardTitle className="text-xl sm:text-2xl">
                {selectedYear}年 {monthNames[selectedMonth]}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear(selectedYear - 1);
                    } else {
                      setSelectedMonth(selectedMonth - 1);
                    }
                  }}
                >
                  前月
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedMonth === 11) {
                      setSelectedMonth(0);
                      setSelectedYear(selectedYear + 1);
                    } else {
                      setSelectedMonth(selectedMonth + 1);
                    }
                  }}
                >
                  翌月
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
              {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
                <div key={day} className="text-center font-semibold text-xs sm:text-sm">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {renderCalendar()}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button size="lg" asChild>
                <Link href="/reservation">
                  <Calendar className="mr-2 h-5 w-5" />
                  予約画面へ進む
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
                午前便
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">6:00 〜 12:00</p>
              <p className="text-gray-600">
                朝一番の新鮮な海で、白いか釣りを楽しめます。
                初心者の方にもおすすめの時間帯です。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                午後便
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">13:00 〜 19:00</p>
              <p className="text-gray-600">
                夕暮れ時の美しい景色とともに、
                ゆったりと釣りを楽しめます。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}