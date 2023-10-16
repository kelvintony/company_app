import React, { useRef, useState, forwardRef, useEffect } from 'react';
import styles from './TradeModal.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import axios from 'axios';
import SiginLoader from '../../SigninLoader/SiginLoader';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/router';

const TradeModal = ({ userId, setShowPopup, showPopup }) => {
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
    email: '',
    balance: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const [fetchUserLoader, setFetchUserLoader] = useState(false);

  const [responseMessage, setResponseMessage] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setFetchUserLoader(true);
    const verifyPay = async () => {
      await axios
        .get(`/api/admin/game/allgames/${userId}`)
        .then(function (res) {
          setFetchUserLoader(false);
          setUserDetails({
            ...UserDetails,
            email: res?.data?.message?.userId,
            // balance: res?.data?.message?.accountBalance,
          });
        })
        .catch(function (error) {
          setFetchUserLoader(false);

          // console.log(error.response.data.message);
        });
    };
    verifyPay();
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

  const handleMakepayment = async () => {
    return;
    setResponseMessage(null);
    setErrorMessage(null);

    setLoading(true);
    setOpen(true); // make sure you set this guy open

    try {
      const res = await axios.put(`/api/admin/users/${userId}`, UserDetails);
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
          className={
            showPopup ? styles.continue_container : styles.hide_container
          }
        >
          <div ref={ref} id='paynow' className={styles.continue_wrapper}>
            <div className={styles.continue_wrapper_header}>
              <p>Edit User</p>
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
                  <label htmlFor='email'>
                    Email: <br />
                    <input
                      type='email'
                      name='email'
                      className={styles.form_control}
                      disabled={true}
                      value={UserDetails?.email}
                      onChange={(e) =>
                        setUserDetails({
                          ...UserDetails,
                          email: e.target.value,
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
                  <label htmlFor='email'>
                    Account Balance: <br />
                    <input
                      type='accountBalance'
                      name='accountBalance'
                      className={styles.form_control}
                      value={UserDetails?.balance}
                      onChange={(e) =>
                        setUserDetails({
                          ...UserDetails,
                          balance: e.target.value,
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
                  <label htmlFor='email'>
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
              </div>
            )}
            <div className={styles.community_buttons}>
              <button onClick={handleModalPopUp} className={styles.btn_cancel}>
                Cancel
              </button>
              <button
                target='_blank'
                // href={`${payStackUrl}`}
                onClick={handleMakepayment}
                className={
                  loading
                    ? `${styles.btn_pay} ${styles.btn_pay_inactive}`
                    : styles.btn_pay
                }
                disabled={loading}
              >
                {loading ? <SiginLoader /> : 'Process Trade'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeModal;
