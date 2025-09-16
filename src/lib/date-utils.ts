// 日本時間での日付操作ユーティリティ

// 日本時間での今日の日付を取得（YYYY-MM-DD形式）
export const getJSTToday = (): string => {
  const now = new Date();
  // 日本のタイムゾーンで日付文字列を取得
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const todayStr = `${year}-${month}-${day}`;

  console.log('JST Today Debug:', {
    utcNow: now.toISOString(),
    jstToday: todayStr
  });

  return todayStr;
};

// 日本時間での日付オブジェクトを取得
export const getJSTDate = (offset: number = 0): Date => {
  // JST今日の日付文字列を取得
  const todayStr = getJSTToday();

  // その日付にオフセット日数を加算（タイムゾーンを考慮）
  const [year, month, day] = todayStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day + offset);

  return targetDate;
};

// 日付文字列がJST今日かどうかを判定
export const isJSTToday = (dateStr: string): boolean => {
  return dateStr === getJSTToday();
};

// 日付文字列をYYYY-MM-DD形式で正規化
export const normalizeDate = (date: string | Date): string => {
  if (typeof date === 'string') {
    // 既にYYYY-MM-DD形式の場合はそのまま
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    // Date オブジェクトとして解析し、YYYY-MM-DD形式に変換
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid date format: ${date}`);
    }
    
    return dateObj.toISOString().split('T')[0];
  } else {
    return date.toISOString().split('T')[0];
  }
};