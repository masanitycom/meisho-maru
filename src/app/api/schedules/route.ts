import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSeatsServer } from '@/lib/supabase-server';
import { getJSTDate } from '@/lib/date-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || new Date().getMonth().toString());
    
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const today = getJSTDate(0);
    
    const datePromises = Array.from({ length: daysInMonth }, async (_, i) => {
      const date = new Date(year, month, i + 1);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
      
      try {
        const [trip1Seats, trip2Seats] = await Promise.all([
          getAvailableSeatsServer(dateStr, 1),
          getAvailableSeatsServer(dateStr, 2)
        ]);
        
        return {
          date: date.toISOString(),
          dateStr,
          trip1Seats,
          trip2Seats,
          dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
          isToday: date.toDateString() === today.toDateString(),
        };
      } catch (error) {
        console.error(`Error fetching seats for ${dateStr}:`, error);
        return {
          date: date.toISOString(),
          dateStr,
          trip1Seats: -1,
          trip2Seats: -1,
          dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
          isToday: date.toDateString() === today.toDateString(),
        };
      }
    });

    const schedules = await Promise.all(datePromises);
    
    return NextResponse.json({ 
      schedules,
      timestamp: new Date().toISOString() 
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Schedule API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}