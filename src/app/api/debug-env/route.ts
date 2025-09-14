import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: process.env.NODE_ENV,
    hasGmailUser: !!process.env.GMAIL_USER,
    gmailUser: process.env.GMAIL_USER,
    hasGmailPassword: !!process.env.GMAIL_APP_PASSWORD,
    gmailPasswordLength: process.env.GMAIL_APP_PASSWORD?.length,
    gmailPasswordPreview: process.env.GMAIL_APP_PASSWORD?.substring(0, 4) + '...',
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    adminEmail: process.env.ADMIN_EMAIL,
    timestamp: new Date().toISOString()
  });
}