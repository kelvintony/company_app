import React, { useRef, useState, forwardRef, useEffect } from 'react';
import styles from './DepositModal.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import axios from 'axios';

import SiginLoader from '../SigninLoader/SiginLoader';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/router';
import { BalanceLoader } from '../BalanceLoader/BalanceLoader';
import { AiFillCheckCircle } from 'react-icons/ai';
import { authConstants } from '../../context/constants';
import { useStore } from '../../context';
import { BiCopy } from 'react-icons/bi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { usdtIcon } from '../../assets';
import Image from 'next/image';

const DepositModal = ({
  setShowPopup,
  showPopup,
  email,
  buttonLoader,
  setButtonLoader,
  amount,
  setAmount,
  transferDetails,
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

  const [state, dispatch] = useStore();

  const [UserDetails, setUserDetails] = useState({
    otp: '',
  });

  const [loading, setLoading] = useState(false);

  const [otpLoading, setOtpLoading] = useState(false);

  const [fetchUserLoader, setFetchUserLoader] = useState(false);

  const [formDataError, setFormDataError] = useState(false);

  const [transactionProcessed, setTransactionProcessed] = useState(false);

  const [responseMessage, setResponseMessage] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  const handleModalPopUp = () => {
    setShowPopup(!showPopup);
    setResponseMessage(null);
    setErrorMessage(null);
    setLoading(false);
    setButtonLoader(false);
    setTransactionProcessed(false);
    setUserDetails({
      otp: '',
    });
  };

  return (
    <>
      {errorMessage && (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
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
            {transactionProcessed && (
              <div className={styles.success_message}>
                <p>Amount withdrawn</p>
                <div className={styles.amount_container}>
                  <p>&#36;{amount}</p>
                  <AiFillCheckCircle className={styles.success_icon} />
                </div>
                <p>Transaction Successful</p>
                <p>
                  Your withdraw was successful and it&apos;s been processed.
                </p>
                <button
                  onClick={handleModalPopUp}
                  className={`${styles.btn_pay} ${styles.btn_pay_contine}`}
                >
                  Continue
                </button>
              </div>
            )}

            {!transactionProcessed && (
              <div className={styles.wrap_them}>
                <div className={styles.continue_wrapper_header}>
                  <p>Make Deposit</p>
                  <MdOutlineCancel
                    onClick={handleModalPopUp}
                    className={styles.continue_cancel_icon}
                  />
                </div>
                <div className={styles.usdt_icon_container}>
                  <Image className={styles.usdt_pix} src={usdtIcon} />
                  <p className={styles.otp_message}>
                    USDT <span style={{ fontWeight: 700 }}>(TRC-20)</span>
                  </p>
                </div>

                {fetchUserLoader ? (
                  <h4>Loading...</h4>
                ) : (
                  <div className={styles.data_wrapper}>
                    <div className={styles.input_wrapper}>
                      <label htmlFor='walletAdress'>
                        Amount:{' '}
                        <span style={{ fontWeight: '600' }}>&#36;{amount}</span>
                      </label>
                    </div>
                    <div className={styles.input_wrapper}>
                      <p>Processing fee</p>
                      <label htmlFor='eventOneExpectedReturns'>
                        <span>
                          {transferDetails?.pay_amount -
                            transferDetails?.price_amount}{' '}
                          USDT
                        </span>
                        <br />
                      </label>
                    </div>
                    <div className={styles.input_wrapper}>
                      <p>Total amount to be paid</p>
                      <label htmlFor='eventOneExpectedReturns'>
                        <span>{transferDetails?.pay_amount} USDT</span>
                        <br />
                      </label>
                    </div>
                    <div className={styles.input_wrapper}>
                      <p>Network Type:</p>
                      <label htmlFor='eventOneExpectedReturns'>
                        <span>TRC-20</span>
                        <br />
                      </label>
                    </div>
                    <div className={styles.input_wrapper}>
                      <p>Transfer to wallet address:</p>
                      <label htmlFor='eventOneExpectedReturns'>
                        <span className={styles.wallet__address}>
                          {transferDetails?.pay_address}
                        </span>
                        <CopyToClipboard
                        // text={UserDetails?.walletAddress}
                        // onCopy={handleCopy}
                        >
                          <button className={styles.btn_copy}>
                            Copy <BiCopy />
                          </button>
                        </CopyToClipboard>
                        <br />
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

export default DepositModal;
