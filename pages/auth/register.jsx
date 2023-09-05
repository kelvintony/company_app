import React, { useState, forwardRef } from 'react';
import styles from '../../styles/Register.module.css';
import { useRouter } from 'next/router';
import LogoItem from '../../components/LogoItem/LogoItem';
import SiginLoader from '../../components/SigninLoader/SiginLoader';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import axios from 'axios';

const Register = () => {
  // ALERT SECTION
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  // THE END OF ALERT SECTION
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    walletAddress: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [responseMessage, setResponseMessage] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  const [formDataError, setFormDataError] = useState(false);

  const [loading, setLoading] = useState(false);

  const submitFormData = async () => {
    // return;
    setErrorMessage(null);
    setResponseMessage(null);
    if (
      formData.firstName.length === 0 ||
      formData.lastName.length === 0 ||
      formData.walletAddress.length === 0 ||
      formData.email.length === 0 ||
      formData.password.length === 0 ||
      formData.confirmPassword.length === 0
    ) {
      return setFormDataError(true);
    }

    if (
      formData.firstName &&
      formData.lastName &&
      formData.walletAddress &&
      formData.email &&
      formData.password &&
      formData.confirmPassword
    ) {
      try {
        setLoading(true);
        setOpen(true); // make sure you set this guy open
        const res = await axios.post('/api/auth/register', formData);
        if (res) {
          setLoading(false);
          setResponseMessage(res.data.message);
          router.push('/auth/register/#register_container');
          await new Promise((resolve) => setTimeout(resolve, 2000));
          // router.push('/auth/login');
          setFormData({
            firstName: '',
            lastName: '',
            walletAddress: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
        }
        setLoading(false);
        console.clear();
      } catch (error) {
        setLoading(false);
        setErrorMessage(error?.response?.data?.message);
        console.clear();
      }
    }
  };

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
          <h3>Create account</h3>
          <p>Let&apos;s get you started with your DaxomPay account.</p>
          {errorMessage && (
            <Snackbar
              open={open}
              autoHideDuration={10000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity='error'
                sx={{ width: '100%' }}
              >
                {errorMessage}
              </Alert>
            </Snackbar>
          )}
          {responseMessage && (
            <Snackbar
              open={open}
              autoHideDuration={10000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity='success'
                sx={{ width: '100%' }}
              >
                {responseMessage}
              </Alert>
            </Snackbar>
          )}
          {responseMessage ? (
            <h4
              style={{
                color: '#09CE5A',
                padding: '5px',
              }}
            >
              {responseMessage}
            </h4>
          ) : (
            <>
              <div className={styles.input_wrapper}>
                <label htmlFor='firstName'>
                  First Name: <br />
                  <input
                    type='text'
                    name='firstName'
                    className={styles.form_control}
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                  <br />
                  {formDataError && formData.firstName.length <= 0 ? (
                    <span style={{ color: 'red' }}>* required</span>
                  ) : (
                    ''
                  )}
                </label>
              </div>
              <div className={styles.input_wrapper}>
                <label htmlFor='lastName'>
                  Last Name: <br />
                  <input
                    type='text'
                    name='lastName'
                    className={styles.form_control}
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                  <br />
                  {formDataError && formData.lastName.length <= 0 ? (
                    <span style={{ color: 'red' }}>* required</span>
                  ) : (
                    ''
                  )}
                </label>
              </div>
              <div className={styles.input_wrapper}>
                <label htmlFor='phoneNumber'>
                  Wallet Adress : <br />
                  <input
                    type='text'
                    name='text'
                    placeholder='USDT TRC-20'
                    className={styles.form_control}
                    value={formData.walletAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        walletAddress: e.target.value,
                      })
                    }
                  />
                  <br />
                  {formDataError && formData.phoneNumber.length <= 0 ? (
                    <span style={{ color: 'red' }}>* required</span>
                  ) : (
                    ''
                  )}
                </label>
              </div>
              <div className={styles.input_wrapper}>
                <label htmlFor='email'>
                  Email: <br />
                  <input
                    type='email'
                    name='email'
                    className={styles.form_control}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <br />
                  {formDataError && formData.email.length <= 0 ? (
                    <span style={{ color: 'red' }}>* required</span>
                  ) : (
                    ''
                  )}
                </label>
              </div>
              <div className={styles.input_wrapper}>
                <label htmlFor='password'>
                  Password: <br />
                  <input
                    type='password'
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <br />
                  {formDataError && formData.password.length <= 0 ? (
                    <span style={{ color: 'red' }}>* required</span>
                  ) : (
                    ''
                  )}
                </label>
              </div>
              <div className={styles.input_wrapper}>
                <label htmlFor='confirmPassword'>
                  Confirm Password: <br />
                  <input
                    type='password'
                    name='confirmPassword'
                    value={formData?.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <br />
                  {formDataError && formData.confirmPassword.length <= 0 ? (
                    <span style={{ color: 'red' }}>* required</span>
                  ) : (
                    ''
                  )}
                </label>
              </div>
              <p>
                By clicking the &#34;Create My Account&#34; button, you agree to{' '}
                <br />
                DaxomPay&apos;s{' '}
                <span
                  style={{ cursor: 'pointer' }}
                  className={styles.create_account_inner}
                >
                  terms of acceptable use.
                </span>{' '}
              </p>
              <button
                onClick={submitFormData}
                className={
                  loading
                    ? `${styles.btn_hero} ${styles.btn_hero_inactive}`
                    : styles.btn_hero
                }
                disabled={loading}
              >
                {loading ? <SiginLoader /> : 'Create my account'}
              </button>
              <button onClick={loginHandler} className={styles.create_account}>
                Already have an account?{' '}
                <span className={styles.create_account_inner}>Log in</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
