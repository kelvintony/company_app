import React, { useRef, useState, forwardRef, useEffect } from 'react';
import styles from './AccountTransactionsModal.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import axios from 'axios';
import SiginLoader from '../../SigninLoader/SiginLoader';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/router';

import { BiCopy } from 'react-icons/bi';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const AccountTransactionsModal = ({
  userId,
  setShowPopup,
  showPopup,
  fetchTransactions,
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
    userId: '',
    password: '',
    paymentStatus: '',
    amount: '',
    whatFor: '',
    walletAddress: '',
    fullName: '',
    concludeTrade: false,
  });

  const [loading, setLoading] = useState(false);

  const [fetchUserLoader, setFetchUserLoader] = useState(false);

  const [responseMessage, setResponseMessage] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  // const [fullName, setfullName] = useState('');

  useEffect(() => {
    setFetchUserLoader(true);
    const verifyPay = async () => {
      const orderId = userId;
      await axios
        .get(`/api/admin/wallet/${orderId}`)
        .then(function (res) {
          setFetchUserLoader(false);
          setUserDetails({
            ...UserDetails,
            userId: res?.data?.message?.userId?._id,
            paymentStatus: res?.data?.message?.paymentStatus,
            amount: res?.data?.message?.amount,
            whatFor: res?.data?.message?.whatFor,
            walletAddress: res?.data?.message?.userId?.walletAddress,
            fullName: res?.data?.message?.userId?.fullName,
          });
        })
        .catch(function (error) {
          setFetchUserLoader(false);

          // console.log(error.response.data.message);
        });
    };
    userId && verifyPay();
  }, [userId]);

  const handleModalPopUp = () => {
    setShowPopup(!showPopup);
    setResponseMessage(null);
    setErrorMessage(null);
    setLoading(false);
    setUserDetails({
      ...UserDetails,
      password: '',
    });
  };

  const handleProcessWithdrawal = async () => {
    setResponseMessage(null);
    setErrorMessage(null);

    setLoading(true);
    setOpen(true); // make sure you set this guy open

    try {
      const orderId = userId;

      const res = await axios.put(`/api/admin/wallet/${orderId}`, UserDetails);
      if (res) {
        setLoading(false);
        setResponseMessage(res.data.message);
        fetchTransactions();
        setShowPopup(!showPopup);

        // handleModalPopUp();
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error?.response?.data?.message);
      console.log('something went wrong');
    }
  };

  const handleCopy = () => {
    setOpen(true); // make sure you set this guy open
    setResponseMessage('Wallet Address copied');
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
              <p>Edit Order Transaction</p>
              <MdOutlineCancel
                onClick={handleModalPopUp}
                className={styles.continue_cancel_icon}
              />
            </div>
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
                  <p>User Id:</p>
                  <label htmlFor='userId'>
                    <span>{UserDetails?.userId}</span>
                    <br />
                  </label>
                </div>
                <div className={styles.input_wrapper}>
                  <p>Full Name:</p>
                  <label htmlFor='userId'>
                    <span>{UserDetails?.fullName}</span>
                    <br />
                  </label>
                </div>
                <div className={styles.input_wrapper}>
                  <p>Amount:</p>
                  <label htmlFor='paymentStatus'>
                    <span>&#36;{UserDetails?.amount}</span>
                    <br />
                  </label>
                </div>
                {UserDetails?.whatFor === 'Wallet withdrawal' && (
                  <div className={styles.input_wrapper}>
                    <p>Wallet Address:</p>
                    <label htmlFor='walletAddress'>
                      <span>{UserDetails?.walletAddress}</span>
                      <CopyToClipboard
                        text={UserDetails?.walletAddress}
                        onCopy={handleCopy}
                      >
                        <button className={styles.btn_copy}>
                          Copy <BiCopy />
                        </button>
                      </CopyToClipboard>
                      <br />
                    </label>
                  </div>
                )}

                {UserDetails?.whatFor === 'Wallet withdrawal' && (
                  <div className={styles.input_wrapper}>
                    <label htmlFor='password'>
                      Password: <br />
                      <input
                        type='password'
                        name='password'
                        className={styles.form_control}
                        value={UserDetails?.password}
                        onChange={(e) =>
                          setUserDetails({
                            ...UserDetails,
                            password: e.target.value,
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
                )}
                {/* <div className={styles.checkbox_container}>
                  <input
                    type='checkbox'
                    name='concludeTrade'
                    value={UserDetails?.concludeTrade}
                    onChange={(e) =>
                      setUserDetails({
                        ...UserDetails,
                        concludeTrade: e.target.checked,
                      })
                    }
                  />
                  Conclude Order
                  <br />
                </div> */}
              </div>
            )}
            {fetchUserLoader ? null : (
              <div className={styles.community_buttons}>
                <button
                  onClick={handleModalPopUp}
                  className={styles.btn_cancel}
                >
                  Cancel
                </button>
                {UserDetails?.whatFor === 'Wallet withdrawal' && (
                  <button
                    target='_blank'
                    // href={`${payStackUrl}`}
                    onClick={handleProcessWithdrawal}
                    className={
                      loading
                        ? `${styles.btn_pay} ${styles.btn_pay_inactive}`
                        : styles.btn_pay
                    }
                    disabled={loading}
                  >
                    {loading ? <SiginLoader /> : 'Complete Order'}
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

export default AccountTransactionsModal;
