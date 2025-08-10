// Validation schemas will be implemented when forms are added
// These will be used for form validation with react-hook-form and zod

export const validationMessages = {
  required: '必須項目です',
  invalidEmail: '正しいメールアドレスを入力してください',
  invalidPhone: '正しい電話番号を入力してください',
  minLength: (min: number) => `${min}文字以上入力してください`,
  maxLength: (max: number) => `${max}文字以内で入力してください`,
};

// Placeholder exports to prevent build errors
export const reservationSchema = {};
export const customerSchema = {};
export const loginSchema = {};
export const scheduleSchema = {};