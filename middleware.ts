import {NextRequest, NextResponse} from 'next/server';
import {i18n} from '@/lib/i18n/i18n-config';

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const pathnameHasLocale = i18n.locales.some(locale =>
    pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) return;

  const locale = i18n.defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
