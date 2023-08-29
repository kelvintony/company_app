import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // console.log('this is middleware session', session);

  const regexUser = new RegExp('/user/*');
  const regexAuth = new RegExp('/auth/*');
  const regexAdmin = new RegExp('/user/admin/*');

  // STOP AN UNSIGNED USER FROM ACCESSING RESTRICTED PAGES
  if (regexUser.test(req.nextUrl.pathname) && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // REDIRECT A SIGNIN USER FROM GOING BACK TO REGISTER
  if (regexAuth.test(req.nextUrl.pathname) && session) {
    return NextResponse.redirect(new URL('/user/dashboard', req.url));
  }

  // STOP AN ORDINARY USER FROM ACCESSING AN ADMIN PAGES
  if (regexAdmin.test(req.nextUrl.pathname) && session.superUser !== true) {
    return NextResponse.redirect(new URL('/user/dashboard', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*', '/auth/:path*'],
};
