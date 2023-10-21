import React, { useEffect } from 'react';
import styles from './withdraw.module.css';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import { useState } from 'react';
import SiginLoader from '../../../components/SigninLoader/SiginLoader';
import { GiMoneyStack } from 'react-icons/gi';
import WithdrawModal from '../../../components/WithdrawModal/WithdrawModal';
import { useStore } from '../../../context';
import axios from 'axios';

import { AlertHandler } from '../../../utils/AlertHandler';

const Withdraw = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '' });
  const [formDataError, setFormDataError] = useState(false);

  const [state, dispatch] = useStore();

  const [buttonLoader, setButtonLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [amount, setAmount] = useState('');

  const [userBalance, setUserBalance] = useState(null);
  const [checkBalanceLoader, setCheckBalanceLoader] = useState(false);

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

  const editUser = async () => {
    setResponseMessage(null);
    setErrorMessage(null);

    if (amount.length === 0) {
      return setFormDataError(true);
    }

    setOpen(true); //! make sure you set this guy open for the MUI alert

    try {
      setCheckBalanceLoader(true);
      const res = await axios.get(`/api/customers/withdraw?amount=${amount}`);
      if (res) {
        setCheckBalanceLoader(false);
        setResponseMessage(res?.data?.message);
        setShowPopup(!showPopup);

        await new Promise((resolve) => setTimeout(resolve, 2000));
        setButtonLoader(true);
      }
    } catch (error) {
      setCheckBalanceLoader(false);
      setErrorMessage(error?.response?.data?.message);
      console.log('');
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
        Make Withdrawals
        <GiMoneyStack className={styles.comming_soon_icon} />
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
            onClick={editUser}
            className={
              loading
                ? `${styles.btn_hero} ${styles.btn_hero_inactive}`
                : styles.btn_hero
            }
            disabled={loading}
          >
            {checkBalanceLoader ? <SiginLoader /> : 'Withdraw'}
          </button>

          <p className={styles.withdraw_text}>
            <span
              style={{
                fontWeight: '700',
                fontSize: '12px',
              }}
            >
              NB: Amounts are rounded up to the whole numbers
            </span>
            , withdrawals takes 5mins - 24hrs to be processed.
          </p>
        </div>
      </section>

      <WithdrawModal
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        amount={amount}
        buttonLoader={buttonLoader}
        setButtonLoader={setButtonLoader}
        email={state?.user?.email}
      />
    </DashboardLayout>
  );
};

export default Withdraw;
