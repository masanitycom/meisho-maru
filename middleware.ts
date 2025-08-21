import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // www付きドメインの場合、非wwwにリダイレクト
  if (host.startsWith('www.')) {
    const newHost = host.replace('www.', '');
    url.host = newHost;
    url.protocol = 'https';
    
    return NextResponse.redirect(url, 301);
  }

  // HTTPの場合、HTTPSにリダイレクト
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};