import React, { useState, useEffect } from 'react';
import styles from '../../styles/Register.module.css';
import { useRouter } from 'next/router';
import LogoItem from '../../components/LogoItem/LogoItem';
import SiginLoader from '../../components/SigninLoader/SiginLoader';

import Swal from 'sweetalert2';

import axios from 'axios';
import NewLoader from '../../components/NewLoader/NewLoader';

const VerifyAccount = () => {
  const router = useRouter();

  const [responseMessage, setResponseMessage] = useState(null);

  const [loading, setLoading] = useState(false);
  const { userid, token } = router.query;

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        setLoading(true);
        setResponseMessage(null);

        const response = await axios.get(
          `/api/verify-account?userid=${userid}&token=${token}`
        );

        if (response) {
          await new Promise((resolve) => setTimeout(resolve, 5000));

          setLoading(false);
          setResponseMessage(response?.data?.message);
          Swal.fire(
            'Account verification was successful!',
            'Now proceed to login',
            'success'
          );
        }
      } catch (error) {
        setLoading(false);
        Swal.fire(
          'Account verification was not successful!',
          'Please contact support',
          'error'
        );
        console.log('');
      }
    };

    userid && verifyAccount();
  }, [userid]);

  const loginHandler = () => {
    router.push('/auth/login');
  };
  return (
    <div id='register_container' className={styles.login_container}>
      <div className={styles.container_inner}>
        <div onClick={() => router.push('/')} className={styles.logo_item}>
          <LogoItem />
        </div>
        <div className={styles.login_wrapper}>
          <h3>Account Verification</h3>
          <p>Hold on while we verify your accouunt</p>

          {loading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <NewLoader />
              <p>verifying account...</p>
            </div>
          ) : (
            responseMessage && (
              <div>
                <h4
                  style={{
                    color: '#09CE5A',
                    padding: '5px',
                    textAlign: 'center',
                    marginBottom: '20px',
                  }}
                >
                  {responseMessage}
                </h4>
                <button
                  onClick={loginHandler}
                  className={
                    loading
                      ? `${styles.btn_hero} ${styles.btn_hero_inactive}`
                      : styles.btn_hero
                  }
                  disabled={loading}
                >
                  {loading ? <SiginLoader /> : 'Proceed to Login'}
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
/*
{loading ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}
    >
      <NewLoader />
      <p>verifying account...</p>
    </div>
  ) : (
    <div>
      <h4
        style={{
          color: '#09CE5A',
          padding: '5px',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        {responseMessage}
      </h4>
      <button
        onClick={loginHandler}
        className={
          loading
            ? `${styles.btn_hero} ${styles.btn_hero_inactive}`
            : styles.btn_hero
        }
        disabled={loading}
      >
        {loading ? <SiginLoader /> : 'Proceed to Login'}
      </button>
    </div>
  )}
  */
