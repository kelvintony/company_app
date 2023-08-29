import React, { useState } from 'react';
import styles from '../../styles/ForgotPassword.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

import axios from 'axios';
import LogoItem from '../../components/LogoItem/LogoItem';

const initialState = {
  password: '',
  confirmPassword: '',
};

const Signin = () => {
  const [formData, setFormData] = useState(initialState);

  const [isLoading, setisLoading] = useState(false);

  const [error, setError] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [message, setMessage] = useState('');

  const router = useRouter();

  const { asPath, pathname } = useRouter();

  const { userid, token } = router.query;

  const handleSubmit = async () => {
    return;
    if (
      formData.confirmPassword.length === 0 ||
      formData.password.length === 0
    ) {
      setError(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords must match');
      return;
    }

    if (formData.password === formData.confirmPassword) {
      setErrorMessage('');
    }

    if (formData.confirmPassword === formData.password) {
      setisLoading(true);
      await axios
        .post(
          `/api/password-recovery/verify-token?userid=${userid}&token=${token}`,
          formData
        )
        .then(function (response) {
          if (response) {
            setisLoading(false);
            setMessage(response.data.message + ', You can Now Log In');
            console.log(response);
            setErrorMessage('');
            // navigate('/signin');
          }
        })
        .catch(function (error) {
          setisLoading(false);
          setMessage('');
          setErrorMessage(error.response.data.message);
        });
    }
  };

  return (
    <>
      <div onClick={() => router.push('/')} className={styles.logo_item}>
        <LogoItem />
      </div>
      <div className={styles.signin_container}>
        <div className={styles.post_input_content}>
          <h3 className={styles.blog_header}>Reset Your Password</h3>
          {errorMessage && (
            <div className={styles.errorMessageContainer}>
              <p>{errorMessage}</p>
            </div>
          )}
          {message && (
            <div className={styles.messageContainer}>
              <p>{message}</p>
            </div>
          )}
          <div className={styles.input_container}>
            Password <br />
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>{' '}
          <br />
          {error && formData.password.length <= 0 ? (
            <label style={{ color: 'red' }}>password can&apos;t be empty</label>
          ) : (
            ''
          )}
          <br />
          <div className={styles.input_container}>
            Confirm Password <br />
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>{' '}
          <br />
          {error && formData.confirmPassword.length <= 0 ? (
            <label style={{ color: 'red' }}>
              confirmPassword can&apos;t be empty
            </label>
          ) : (
            ''
          )}
          <div>
            <button
              className={styles.btn_submit}
              type='submit'
              onClick={handleSubmit}
            >
              {isLoading ? 'Submitting...' : 'Send Reset Link'}
            </button>{' '}
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
{
  /* <div className={styles.signin_container}>
  <div className={styles.post_input_content}>
    <h3 className={styles.blog_header}>Reset Password</h3>
    {errorMessage && (
      <div className={styles.errorMessageContainer}>
        <p>{errorMessage}</p>
      </div>
    )}{' '}
    <br />
    {message && (
      <div className={styles.messageContainer}>
        <p>{message}</p>
      </div>
    )}
    <label>
      Password <br />
      <input
        type='password'
        name='password'
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </label>{' '}
    <br />
    {error && formData.password.length <= 0 ? (
      <label style={{ color: 'red' }}>password can&apos;t be empty</label>
    ) : (
      ''
    )}
    <br />
    <label>
      Confirm Password <br />
      <input
        type='password'
        name='confirmPassword'
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
      />
    </label>
    <br />
    {error && formData.confirmPassword.length <= 0 ? (
      <label style={{ color: 'red' }}>
        confirmPassword can&apos;t be empty
      </label>
    ) : (
      ''
    )}
    <br />
    <div>
      <button
        className={styles.btn_submit}
        type='submit'
        onClick={handleSubmit}
      >
        {isLoading ? 'Loading...' : 'Reset Password'}
      </button>{' '}
    </div>
  </div>
</div>; */
}
