// No-op middleware to override any imported auth middleware.
// This will satisfy Next.js's expectation of a middleware.ts without
// pulling in @ai-sdk/next or any other missing package.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // no-op
  return NextResponse.next();
}
