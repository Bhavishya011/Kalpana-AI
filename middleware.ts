import {NextRequest, NextResponse} from 'next/server';
import {i18n} from '@/lib/i18n/i18n-config';

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
    pathname === '/' ||
    pathname === `/${locale}` ||
    pathname === `/${locale}/` ||
    pathname === `/${locale}/login` ||
    publicRoutes.some(route => pathname === `/${locale}${route}`);

  const session = request.cookies.get('firebase-session')?.value;

  // Handle locale redirects first
  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Allow access to public routes without authentication
  if (isPublicRoute) {
    // If user is already logged in and trying to access login page, redirect to dashboard
    if (session && pathname === `/${locale}/login`) {
      return NextResponse.redirect(
        new URL(`/${locale}/dashboard`, request.nextUrl)
      );
    }
    // Allow access to other public routes
    return NextResponse.next();
  }

  // For protected routes, require authentication
  if (!session) {
    return NextResponse.redirect(
      new URL(`/${locale}/login`, request.nextUrl)
    );
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
