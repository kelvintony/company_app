import React, { useRef, useState, forwardRef, useEffect } from 'react';
import styles from './TradeModal.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import axios from 'axios';
import SiginLoader from '../SigninLoader/SiginLoader';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/router';

const eventOptions = [
  {
    id: '1',
    eventOption: 'event 1',
  },
  {
    id: '2',
    eventOption: 'event 2',
  },
];

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
    userId: '',
    password: '',
    eventOneExpectedReturns: '',
    eventOneRoi: '',
    eventTwoExpectedReturns: '',
    eventTwoRoi: '',
    concludedEvent: '',
  });

  const [loading, setLoading] = useState(false);

  const [fetchUserLoader, setFetchUserLoader] = useState(false);

  const [responseMessage, setResponseMessage] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  // const [selectedEvent, setSelectedEvent] = useState('');

  const [eventOptionType, setEventOptionType] = useState(eventOptions);

  useEffect(() => {
    setFetchUserLoader(true);
    const verifyPay = async () => {
      await axios
        .get(`/api/customers/transactions/${userId}`)
        .then(function (res) {
          setFetchUserLoader(false);
          setUserDetails({
            ...UserDetails,
            userId: res?.data?.message?._id,
            eventOneExpectedReturns:
              res?.data?.message?.eventOneStats?.expectedReturns
                ?.$numberDecimal,
            eventOneRoi:
              res?.data?.message?.eventOneStats?.eventRoi?.$numberDecimal,
            eventTwoExpectedReturns:
              res?.data?.message?.eventTwoStats?.expectedReturns
                ?.$numberDecimal,
            eventTwoRoi:
              res?.data?.message?.eventTwoStats?.eventRoi?.$numberDecimal,
            concludedEvent: res?.data?.message?.concludedEvent,
            // balance: res?.data?.message?.accountBalance,
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
              <p>Trade Details</p>
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
                  <p>Trade Id:</p>
                  <label htmlFor='userId'>
                    <span>{UserDetails?.userId}</span>
                    <br />
                  </label>
                </div>
                <div
                  className={`${styles.input_wrapper} ${
                    UserDetails?.concludedEvent === 'event 1'
                      ? styles.success_input_wrapper
                      : ''
                  }`}
                >
                  <p>Outcome 1:</p>
                  <label htmlFor='eventOneExpectedReturns'>
                    <span>
                      Expected Returns: &#36;
                      {UserDetails?.eventOneExpectedReturns}
                    </span>{' '}
                    <br />
                    <span>Event ROI: &#36;{UserDetails?.eventOneRoi}</span>
                    <br />
                  </label>
                </div>
                <div
                  className={`${styles.input_wrapper} ${
                    UserDetails?.concludedEvent === 'event 2'
                      ? styles.success_input_wrapper
                      : ''
                  }`}
                >
                  <p>Outcome 2:</p>
                  <label htmlFor='eventTwoExpectedReturns'>
                    <span>
                      Expected Returns: &#36;
                      {UserDetails?.eventTwoExpectedReturns}
                    </span>{' '}
                    <br />
                    <span>Event ROI: &#36;{UserDetails?.eventTwoRoi}</span>
                    <br />
                  </label>
                </div>
                {UserDetails?.concludedEvent && (
                  <div
                    className={`${styles.input_wrapper} ${
                      UserDetails?.concludedEvent === 'event 1' ||
                      UserDetails?.concludedEvent === 'event 2'
                        ? styles.success_input_wrapper
                        : ''
                    }`}
                  >
                    {UserDetails?.concludedEvent && (
                      <label htmlFor='eventTwoExpectedReturns'>
                        <span>
                          {UserDetails?.concludedEvent === 'event 1'
                            ? 'Outcome 1 was concluded'
                            : 'Outcome 2 was concluded'}
                        </span>
                        <br />
                      </label>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeModal;
