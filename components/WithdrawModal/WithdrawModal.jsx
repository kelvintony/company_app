import React, { useRef, useState, forwardRef, useEffect } from 'react';
import styles from './WithdrawModal.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import axios from 'axios';

import SiginLoader from '../SigninLoader/SiginLoader';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/router';
import { BalanceLoader } from '../BalanceLoader/BalanceLoader';

const WithdrawModal = ({
  setShowPopup,
  showPopup,
  email,
  buttonLoader,
  setButtonLoader,
  amount,
}) => {
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

  const ref = useRef(null);

  const [UserDetails, setUserDetails] = useState({
    walletAddress: '',
    otp: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);

  const [otpLoading, setOtpLoading] = useState(false);

  const [fetchUserLoader, setFetchUserLoader] = useState(false);

  const [responseMessage, setResponseMessage] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  const handleModalPopUp = () => {
    setShowPopup(!showPopup);
    setResponseMessage(null);
    setErrorMessage(null);
    setLoading(false);
    setButtonLoader(false);
    setUserDetails({
      walletAddress: '',
      otp: '',
      email: '',
    });
  };

  const handleWalletUpdate = async () => {
    // router.replace(router.asPath);
    setShowPopup(!showPopup);
    runfetch();

    setResponseMessage(null);
    setErrorMessage(null);

    setLoading(true);
    setOpen(true); // make sure you set this guy open

    try {
      const res = await axios.post(
        `/api/customers/user-wallet-profile/updatewallet`,
        UserDetails
      );
      if (res) {
        setLoading(false);
        setResponseMessage(res.data.message);
        // handleModalPopUp();
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error?.response?.data?.message);
      console.log('something went wrong');
    }
  };

  const sendOTP = async () => {
    setResponseMessage(null);
    setErrorMessage(null);

    setOpen(true); // make sure you set this guy open
    setOtpLoading(true);

    try {
      const res = await axios.get(
        `/api/customers/user-wallet-profile/updatewallet`
      );
      if (res) {
        setOtpLoading(false);
        setResponseMessage(res.data.message);
      }
    } catch (error) {
      setOtpLoading(false);
      setErrorMessage(error?.response?.data?.message);
      console.log('something went wrong');
    }
  };
  return (
    <>
      <div
        style={{
          marginTop: '0px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          className={`${styles.continue_container} ${
            showPopup ? styles.active : styles.inactive
          }`}
        >
          <div ref={ref} id='paynow' className={styles.continue_wrapper}>
            <div className={styles.continue_wrapper_header}>
              <p>Withdraw</p>
              <MdOutlineCancel
                onClick={handleModalPopUp}
                className={styles.continue_cancel_icon}
              />
            </div>
            <p className={styles.otp_message}>
              One Time password will be sent to{' '}
              <span style={{ fontWeight: 700 }}>{email}</span>, Kindly click on
              &quot;Send Otp&quot;
            </p>
            <button
              disabled={otpLoading}
              onClick={sendOTP}
              className={styles.resend_otp}
            >
              {otpLoading ? 'Sending Otp...' : 'Send OTP'}
            </button>
            {errorMessage && (
              <Snackbar
                open={open}
                autoHideDuration={5000}
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
                autoHideDuration={5000}
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

            {fetchUserLoader ? (
              <h4>Loading...</h4>
            ) : (
              <div className={styles.data_wrapper}>
                <div className={styles.input_wrapper}>
                  <label htmlFor='otp'>
                    OTP: <br />
                    <input
                      type='text'
                      name='otp'
                      className={styles.form_control}
                      value={UserDetails?.otp}
                      onChange={(e) =>
                        setUserDetails({
                          ...UserDetails,
                          otp: e.target.value,
                        })
                      }
                    />
                    <br />
                    {/* {formDataError && formData.email.length <= 0 ? (
                <span style={{ color: 'red' }}>* required</span>
              ) : (
                ''
              )} */}
                  </label>
                </div>
                <div className={styles.input_wrapper}>
                  <label htmlFor='walletAdress'>
                    Amount:{' '}
                    <span style={{ fontWeight: '600' }}>&#36;{amount}</span>
                  </label>
                </div>
              </div>
            )}
            {!buttonLoader && <BalanceLoader />}
            {fetchUserLoader ? null : (
              <div className={styles.community_buttons}>
                {buttonLoader && (
                  <button
                    onClick={handleModalPopUp}
                    className={styles.btn_cancel}
                  >
                    Cancel
                  </button>
                )}
                {buttonLoader && (
                  <button
                    // href={`${payStackUrl}`}
                    onClick={handleWalletUpdate}
                    className={
                      loading
                        ? `${styles.btn_pay} ${styles.btn_pay_inactive}`
                        : styles.btn_pay
                    }
                    disabled={loading}
                  >
                    {loading ? <SiginLoader /> : 'Withdraw'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawModal;