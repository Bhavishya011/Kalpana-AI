import {NextRequest, NextResponse} from 'next/server';
import {i18n} from '@/lib/i18n/i18n-config';
import {get} from '@vercel/edge-config';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const pathnameHasLocale = i18n.locales.some(locale =>
    pathname.startsWith(`/${locale}/`)
  );

  let locale;
  if (pathnameHasLocale) {
    locale = pathname.split('/')[1];
  } else {
    locale = i18n.defaultLocale;
  }

  const publicRoutes = ['/', '/login'];
  const isPublicRoute =
    publicRoutes.some(route => pathname === `/${locale}${route}`) ||
    pathname === `/${locale}`;

  const session = request.cookies.get('firebase-session')?.value;

  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(
      new URL(`/${locale}/login`, request.nextUrl)
    );
  }

  if (session && pathname === `/${locale}/login`) {
    return NextResponse.redirect(
      new URL(`/${locale}/dashboard`, request.nextUrl)
    );
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
