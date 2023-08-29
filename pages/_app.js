import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import React from 'react';
import Router, { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Script from 'next/script';

//progress bar from MUI
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import NextNProgress from 'nextjs-progressbar';

import { StoreProvider } from '../context';

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <NextNProgress
            color='#29D'
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            showOnShallow={true}
          />

          <Script
            src='https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver'
            strategy='beforeInteractive'
          />
          {Component.auth ? (
            <Auth adminOnly={Component.auth.adminOnly}>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </SessionProvider>
    </StoreProvider>
  );
}
function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/');
    },
  });
  if (status === 'loading') {
    // return <div>Loading...</div>;
    return <div></div>;
  }
  if (adminOnly && !session.user.superUser) {
    router.push('/');
  }

  return children;
}
export default MyApp;
