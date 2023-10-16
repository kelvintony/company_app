import React, { useState, forwardRef } from 'react';
import styles from '../../styles/Login.module.css';
import { useRouter } from 'next/router';
import LogoItem from '../../components/LogoItem/LogoItem';
import SiginLoader from '../../components/SigninLoader/SiginLoader';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { signIn, getSession, useSession } from 'next-auth/react';
import { useStore } from '../../context';
import { authConstants } from '../../context/constants';
import axios from 'axios';

const Login = () => {
  //! ALERT SECTION
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
  //! THE END OF ALERT SECTION

  const router = useRouter();

  const [state, dispatch] = useStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [responseMessage, setResponseMessage] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  const [formDataError, setFormDataError] = useState(false);

  const [loading, setLoading] = useState(false);

  const submitFormData = async () => {
    setErrorMessage(null);
    setResponseMessage(null);
    if (formData.email.length === 0 || formData.password.length === 0) {
      return setFormDataError(true);
    }

    if (formData.email && formData.password) {
      setLoading(true);
      setOpen(true); //! make sure you set this guy open for the MUI alert

      dispatch({
        type: authConstants.LOGIN_REQUEST,
      });
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      try {
        if (result.ok) {
          const session = await getSession();
          dispatch({
            type: authConstants.LOGIN_SUCCESS,
            payload: session,
          });
          setLoading(false);
          setFormData({
            email: '',
            password: '',
          });
          setResponseMessage('log in succesful');
          router.push('/user/dashboard');
        } else {
          setLoading(false);
          dispatch({
            type: authConstants.LOGIN_FAILURE,
            payload: result.error,
          });
          setErrorMessage(result.error);
          console.clear();
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error?.response?.data?.message);
        console.clear();
      }
    }
  };

  const registerHandler = () => {
    router.push('/auth/register');
  };
  return (
    <div className={styles.login_container}>
      <div className={styles.container_inner}>
        <div onClick={() => router.push('/')} className={styles.logo_item}>
          <LogoItem />
        </div>
        <div className={styles.login_wrapper}>
          <h3>Login to your account</h3>

          {errorMessage && (
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
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
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity='success'
                sx={{ width: '100%' }}
              >
                {responseMessage}
              </Alert>
            </Snackbar>
          )}

          <div className={styles.input_wrapper}>
            <label htmlFor='email'>
              Email: <br />
              <input
                type='email'
                name='email'
                className={styles.form_control}
                value={formData?.email}
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
                value={formData?.password}
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
          <button
            onClick={() => router.push('/auth/forgot-password')}
            className={styles.forgot_password}
          >
            Forgot Password?
          </button>
          <button
            onClick={submitFormData}
            className={
              loading
                ? `${styles.btn_hero} ${styles.btn_hero_inactive}`
                : styles.btn_hero
            }
            disabled={loading}
          >
            {loading ? <SiginLoader /> : 'Login'}
          </button>
          <button onClick={registerHandler} className={styles.create_account}>
            New to DaxomPay?{' '}
            <span className={styles.create_account_inner}>
              Create an account
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
