import React, { useEffect } from 'react';
import styles from './deposit.module.css';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import { useState } from 'react';
import SiginLoader from '../../../components/SigninLoader/SiginLoader';
import DepositModal from '../../../components/DepositModal/DepositModal';
import { useStore } from '../../../context';
import axios from 'axios';

import { AlertHandler } from '../../../utils/AlertHandler';
import { RiLuggageDepositLine } from 'react-icons/ri';

const Deposit = () => {
  const [loading, setLoading] = useState(false);
  const [formDataError, setFormDataError] = useState(false);

  const [state, dispatch] = useStore();

  const [buttonLoader, setButtonLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [amount, setAmount] = useState('');
  const [transferDetails, setTransferDetails] = useState({});

  //! ALERT SECTION
  const [errorMessage, setErrorMessage] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [open, setOpen] = useState(false);
  //! THE END OF ALERT SECTION

  const handleInputChange = (e) => {
    // Remove any non-numeric characters and existing commas before updating the input value
    const valueWithoutNonNumericChars = e.target.value.replace(/[^0-9]/g, '');
    const valueWithoutCommas = valueWithoutNonNumericChars.replace(/,/g, '');

    // Parse the input value as a number
    const numberValue = Number(valueWithoutCommas);

    // Check if the parsed number is a valid number
    if (!isNaN(numberValue)) {
      // Format the number with commas and update the state, only if the input value is not empty
      const formattedValue =
        valueWithoutCommas !== '' ? numberValue.toLocaleString() : '';
      setAmount(formattedValue);
    } else {
      // If the input is not a valid number, set the input value as is
      setAmount(valueWithoutCommas);
    }
  };

  const handleWithdraw = async () => {
    if (amount.length === 0) {
      return setFormDataError(true);
    }

    setResponseMessage(null);
    setErrorMessage(null);

    setLoading(true);
    setOpen(true); // make sure you set this guy open

    try {
      const res = await axios.post(`/api/payments`, {
        amount: Number(amount.replace(/,/g, '')),
      });

      if (res) {
        setLoading(false);
        setTransferDetails(res.data.message);
        setShowPopup(!showPopup);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error?.response?.data?.message);
      console.log('something went wrong');
    }
  };

  return (
    <DashboardLayout>
      <AlertHandler
        errorMessage={errorMessage}
        open={open}
        setOpen={setOpen}
        responseMessage={responseMessage}
      />
      <h3 className={styles.header}>
        Make Deposit
        <RiLuggageDepositLine className={styles.comming_soon_icon} />
      </h3>
      <section className={styles.withdraw_container}>
        <div className={styles.login_wrapper}>
          <div className={styles.input_wrapper}>
            <label htmlFor='amount'>
              Amount (&#36;): <br />
              <input
                type='text'
                name='amount'
                className={styles.form_control}
                value={amount}
                onChange={handleInputChange}
              />
              <br />
              {formDataError && amount.length <= 0 ? (
                <span style={{ color: 'red' }}>* required</span>
              ) : (
                ''
              )}
            </label>
          </div>

          <button
            onClick={handleWithdraw}
            className={
              loading
                ? `${styles.btn_hero} ${styles.btn_hero_inactive}`
                : styles.btn_hero
            }
            disabled={loading}
          >
            {loading ? <SiginLoader /> : 'Deposit'}
          </button>
        </div>
      </section>

      <DepositModal
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        amount={amount}
        buttonLoader={buttonLoader}
        setButtonLoader={setButtonLoader}
        email={state?.user?.email}
        setAmount={setAmount}
        transferDetails={transferDetails}
      />
    </DashboardLayout>
  );
};

export default Deposit;
