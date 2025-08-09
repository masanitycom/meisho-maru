import { z } from 'zod';

export const reservationSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  phone: z.string().regex(/^\d{10,11}$/, '正しい電話番号を入力してください'),
  email: z.string().email('正しいメールアドレスを入力してください').optional().or(z.literal('')),
  schedule_date: z.string().min(1, '日付を選択してください'),
  trip_number: z.enum(['1', '2']).transform(val => parseInt(val) as 1 | 2),
  people_count: z.number().min(1, '1名以上').max(10, '10名以下'),
  rod_rental: z.boolean(),
  special_requests: z.string().optional(),
});

export const customerSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  phone: z.string().regex(/^\d{10,11}$/, '正しい電話番号を入力してください'),
  email: z.string().email('正しいメールアドレスを入力してください').optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上入力してください'),
});

export const scheduleSchema = z.object({
  date: z.string().min(1, '日付を選択してください'),
  trip_number: z.enum(['1', '2']).transform(val => parseInt(val) as 1 | 2),
  max_seats: z.number().min(1, '1席以上').max(20, '20席以下'),
  is_confirmed: z.boolean(),
  weather_note: z.string().optional(),
  special_note: z.string().optional(),
});