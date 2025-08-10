export const SITE_CONFIG = {
  name: '明勝丸',
  description: '鳥取県の白いか遊漁船',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  contact: {
    phone: '090-1234-5678',
    email: 'info@meisho-maru.com',
    address: '鳥取県東伯郡琴浦町大字別所１１２８番地',
  },
};

export const TRIP_TIMES = {
  1: {
    label: '午前便',
    time: '6:00～12:00',
    departure: '6:00',
    return: '12:00',
  },
  2: {
    label: '午後便',
    time: '13:00～19:00',
    departure: '13:00',
    return: '19:00',
  },
} as const;

export const PRICES = {
  adult: 10000,
  rodRental: 2000,
} as const;

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