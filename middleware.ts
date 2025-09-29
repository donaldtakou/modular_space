import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  // Middleware simple sans redirection
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};