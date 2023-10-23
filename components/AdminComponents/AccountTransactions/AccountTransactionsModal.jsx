import React, { useRef, useState, forwardRef, useEffect } from 'react';
import styles from './AccountTransactionsModal.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import axios from 'axios';
import SiginLoader from '../../SigninLoader/SiginLoader';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/router';
import ScrollToTopOnLoad from '../../ScrollToTopButton/ScrollToTopOnLoad';

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

const AccountTransactionsModal = ({ userId, setShowPopup, showPopup }) => {
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
    concludeTrade: false,
    selectedEvent: '',
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
        .get(`/api/admin/game/allgames/${userId}`)
        .then(function (res) {
          setFetchUserLoader(false);
          setUserDetails({
            ...UserDetails,
            userId: res?.data?.message?.userId,
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

  const handleConcludeTrade = async () => {
    setResponseMessage(null);
    setErrorMessage(null);

    setLoading(true);
    setOpen(true); // make sure you set this guy open

    try {
      const res = await axios.put(
        `/api/admin/game/allgames/${userId}`,
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
              <p>Edit User Trade</p>
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
                  <p>Event One:</p>
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
                <div className={styles.input_wrapper}>
                  <p>Event Two:</p>
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
                <div className={styles.input_wrapper}>
                  <label htmlFor='selectedEvent'>
                    Event: <br />
                    <select
                      name='selectedEvent'
                      id=''
                      value={UserDetails?.selectedEvent}
                      onChange={(e) =>
                        setUserDetails({
                          ...UserDetails,
                          selectedEvent: e.target.value,
                        })
                      }
                    >
                      <option>select event</option>
                      {eventOptionType.map((events) => {
                        return (
                          <option key={events.id} value={events.eventOption}>
                            {events.eventOption}
                          </option>
                        );
                      })}
                    </select>
                    <br />
                    {/* {formDataError && selectedEvent.length <= 0 ? (
                      <span style={{ color: 'red' }}>* required</span>
                    ) : (
                      ''
                    )} */}
                  </label>
                </div>
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
                <div className={styles.checkbox_container}>
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
                  Conclude Trade
                  <br />
                </div>
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
                <button
                  target='_blank'
                  // href={`${payStackUrl}`}
                  onClick={handleConcludeTrade}
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountTransactionsModal;
