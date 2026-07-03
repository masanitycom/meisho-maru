export const SITE_CONFIG = {
  name: '明勝丸',
  description: '鳥取県の白いか遊漁船',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  contact: {
    phone: '090-4695-3087',
    phoneLabel: '予約専用ダイヤル',
    email: 'ikameishomaru@gmail.com',
    address: '鳥取県東伯郡琴浦町大字別所１１２８番地',
  },
};

export const TRIP_TIMES = {
  1: {
    label: '1便',
    time: '17:30～23:30',
    departure: '17:30過ぎ',
    return: '23:30頃',
  },
  2: {
    label: '2便',
    time: '24:00～5:30',
    departure: '24:00頃',
    return: '5:30頃',
  },
} as const;

export const PRICES = {
  adult: 11000,
  rodRental: 2000,
} as const;

// 乗り場までの行き方・乗船位置のご案内動画
// ★動画をYouTubeにアップロードしたら、下の youtubeId を差し替えてください
//   例: https://www.youtube.com/watch?v=Abc123XYZ  →  youtubeId: 'Abc123XYZ'
//   （URLの v= の後ろ、または youtu.be/ の後ろの文字列がIDです）
export const ACCESS_VIDEOS = [
  {
    youtubeId: 'W9tTPiUD4kg',
    title: '赤碕港 遊漁船乗り場のご案内',
    description: '赤碕港遊漁船乗り場までのルートを動画でご案内します。',
  },
  {
    youtubeId: '5SCG5W1QUYw',
    title: '明勝丸の乗船場所と駐車スペース',
    description: '当日、明勝丸が停まっている乗船位置と駐車スペースを動画でご案内します。',
  },
] as const;

// 動画が縦型（YouTube Shorts）かどうか。埋め込みの縦横比に使用
export const ACCESS_VIDEOS_ARE_VERTICAL = true;

// YouTube ID から各種URLを生成するヘルパー
export const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube.com/embed/${id}`;
export const youtubeWatchUrl = (id: string) =>
  `https://www.youtube.com/watch?v=${id}`;
export const youtubeThumbnailUrl = (id: string) =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const RESERVATION_STATUS = {
  confirmed: '確定',
  cancelled: 'キャンセル',
  completed: '完了',
  no_show: '不参加',
} as const;

export const PAYMENT_STATUS = {
  pending: '未払い',
  paid: '支払済',
  cancelled: 'キャンセル',
} as const;

export const SCHEDULE_STATUS = {
  available: '予約可',
  full: '満席',
  cancelled: '欠航',
} as const;