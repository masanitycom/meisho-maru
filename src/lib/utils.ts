import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatTime(tripNumber: 1 | 2) {
  return tripNumber === 1 ? '午前便 (6:00～12:00)' : '午後便 (13:00～19:00)';
}

export function formatPhoneNumber(phone: string) {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
}

export function calculateTotalAmount(peopleCount: number, rodRental: boolean) {
  const basePrice = 11000;
  const rodRentalPrice = 2000;
  return peopleCount * basePrice + (rodRental ? rodRentalPrice * peopleCount : 0);
}