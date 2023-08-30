import React, { useEffect } from 'react';
import Navbar from './Navbar/Navbar';
import { useStore } from '../context';
import { authConstants } from '../context/constants';
import { getSession, useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Footer from './Footer/Footer';
import Head from 'next/head';

const Layout = ({ children }) => {
  const [state, dispatch] = useStore();

  const router = useRouter();

  const { asPath, pathname } = useRouter();

  const { status, data: session } = useSession();

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = state?.user?.authenticated;
      if (!authenticated) {
        // console.log('from Layout', authenticated);
        dispatch({ type: authConstants.LOGIN_REQUEST });
        const session = await getSession();
        if (session) {
          dispatch({
            type: authConstants.LOGIN_SUCCESS,
            payload: session,
          });
        } else {
          dispatch({
            type: authConstants.LOGIN_FAILURE,
            payload: session,
          });
        }
      }
    };
    checkAuthentication();
  }, []);

  const regex = new RegExp('/user/*');
  const regexa = new RegExp('/auth/*');

  return (
    <div>
      <Head>
        <title>No. 1 Leading Arbitrage platform</title>
        <meta name='description' content='No. 1 Leading Arbitrage platform' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {regex.test(pathname) || regexa.test(pathname) ? null : <Navbar />}
      {children}
      {regex.test(pathname) || regexa.test(pathname) ? null : <Footer />}
    </div>
  );
};

export default Layout;
