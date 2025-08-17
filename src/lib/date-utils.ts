// 日本時間での日付操作ユーティリティ

// 日本時間での今日の日付を取得（YYYY-MM-DD形式）
export const getJSTToday = (): string => {
  const now = new Date();
  // JST = UTC+9
  const jstOffset = 9 * 60; // 分単位
  const jstTime = new Date(now.getTime() + (jstOffset * 60 * 1000));
  const todayStr = jstTime.toISOString().split('T')[0];
  
  console.log('JST Today Debug:', {
    utcNow: now.toISOString(),
    jstTime: jstTime.toISOString(),
    todayStr: todayStr
  });
  
  return todayStr;
};

// 日本時間での日付オブジェクトを取得
export const getJSTDate = (offset: number = 0): Date => {
  // JST今日の日付文字列を取得
  const todayStr = getJSTToday();
  
  // その日付にオフセット日数を加算
  const baseDate = new Date(todayStr + 'T00:00:00.000Z');
  const targetDate = new Date(baseDate);
  targetDate.setUTCDate(baseDate.getUTCDate() + offset);
  
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