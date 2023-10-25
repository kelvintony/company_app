import React, { useState } from 'react';
import styles from '../../styles/ForgotPassword.module.css';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LogoItem from '../../components/LogoItem/LogoItem';
import dp4_removebg from '../../assets/dp4_removebg.png';
import Image from 'next/image';

const initialState = {
  email: '',
};

const ForgotPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialState);

  const [isLoading, setisLoading] = useState(false);

  const [error, setError] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (formData.email.length === 0) {
      setError(true);
    }

    if (formData.email) {
      setErrorMessage(null);
      setisLoading(true);
      await axios
        .post('/api/password-recovery/', formData)
        .then(function (response) {
          if (response) {
            // localStorage.setItem('profile', JSON.stringify(response.data));
            setisLoading(false);
            setMessage(
              'Email has been sent, check your inbox or spam for password reset link'
            );
          }
        })
        .catch(function (error) {
          setisLoading(false);
          setErrorMessage(error.response.data.message);
          console.log(error);
        });
      // console.log(formData);
    }
  };

  return (
    <>
      <div onClick={() => router.push('/')} className={styles.logo_container2}>
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
          <p className={styles.writeup}>
            To reset your password, enter the email address you use to log in.
          </p>
          <div className={styles.input_container}>
            Email <br />
            <input
              type='text'
              name='email'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>{' '}
          <br />
          {error && formData.email.length <= 0 ? (
            <label style={{ color: 'red' }}>email can&apos;t be empty</label>
          ) : (
            ''
          )}
          <div>
            <button
              className={styles.btn_submit}
              type='submit'
              onClick={handleSubmit}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>{' '}
            <div className={styles.back_to_login}>
              <Link href='/auth/login'>
                Never mind! <span>Take me back to login</span>{' '}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
