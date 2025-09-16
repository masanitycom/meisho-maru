import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      environment: process.env.NODE_ENV,
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 8) + "...",
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailPassword: !!process.env.GMAIL_APP_PASSWORD,
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to check environment variables",
      details: String(error)
    }, { status: 500 });
  }
}
