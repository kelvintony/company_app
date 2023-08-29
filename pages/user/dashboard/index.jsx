import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import styles from './dashboard.module.css';
import { BsFillWalletFill } from 'react-icons/bs';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { flutterWave_icon, paystack_icon } from '../../../assets';
import TransactionTable from '../../../components/TransactionTable/TransactionTable';
import Image from 'next/image';
import { FaWallet } from 'react-icons/fa';
import { RiInformationLine } from 'react-icons/ri';
import { MdOutlineCancel, MdRefresh } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useStore } from '../../../context';
import { authConstants } from '../../../context/constants';
import PaymentModal from '../../../components/PaymentModal/PaymentModal';

import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { BalanceLoader2 } from '../../../components/BalanceLoader/BalanceLoader';
import { useSession } from 'next-auth/react';
import { TransactionTable2 } from '../../../components/TransactionTable/TransactionTable';

const UserDashboard = () => {
  const router = useRouter();

  const { status, data: session } = useSession();

  const { asPath, pathname } = useRouter();

  const [state, dispatch] = useStore();

  const ref = useRef(null);

  const searchParams = useSearchParams();

  const reference = searchParams.get('reference');

  const [loadBalance, setLoadBalance] = useState(false);

  const [loadReferenceBalance, setLoadReferenceBalance] = useState(false);

  const [accoutDetails, setAccoutDetails] = useState(null);

  const [localStorageAccountDetails, setLocalStorageAccountDetails] =
    useState(null);

  console.log('dashboard ran');

  useEffect(() => {
    if (reference !== null) {
      //
      const verifyPay = async () => {
        await axios
          .get(`/api/customers/make-payment/?reference=${reference}`)
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error.response.data.message);
          });
      };
      verifyPay();

      console.log('paystack reference 2', reference);
    }
  }, [reference]);

  useEffect(() => {
    const fetchCustomerAccount = async () => {
      await axios
        .get('/api/monnify/create-customer')
        .then(function (response) {
          setAccoutDetails(response?.data?.message);
          localStorage?.setItem(
            'accountInfo',
            JSON?.stringify(response?.data?.message)
          );
          setLocalStorageAccountDetails(
            JSON?.parse(localStorage?.getItem('accountInfo'))
          );
        })
        .catch(function (error) {
          // console.log(error.response.data.message);
          console.log(error);
        });
    };

    fetchCustomerAccount();
  }, []);

  useEffect(() => {
    setLocalStorageAccountDetails(
      JSON?.parse(localStorage?.getItem('accountInfo'))
    );
  }, []);

  const handleModalPopUp = () => {
    dispatch({
      type: authConstants.SHOW_PAYMENT_MODAL,
    });
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUserTransaction = async () => {
    setLoadBalance(true);
    try {
      const res = await axios.get('/api/customers/user-transaction-details');
      if (res) {
        setLoadBalance(false);

        dispatch({
          type: authConstants.FETCH_USER_TRANSACTION_DETAILS,
          payload: res.data,
        });
      }
    } catch (error) {
      setLoadBalance(false);

      console.log(error);
    }
  };

  const fetchReferalBalance = async () => {
    setLoadReferenceBalance(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setLoadReferenceBalance(false);
  };

  const sendWhatsappMessage = () => {
    const phoneNumber = '2348110056647';
    const whatsappLink = `https://wa.me/${phoneNumber}`;
    window.open(whatsappLink, '_blank');
  };
  return (
    <DashboardLayout>
      <>
        <div className={styles.section_a}>
          <div className={styles.inner_a}>
            <div className={styles.inner_sub}>
              <div className={styles.wallet_logo_container}>
                <FaWallet className={styles.wallect_balance_icons} />
              </div>
              <div className={styles.wallet_balance}>
                <p>Wallet Balance</p>
                <p
                  style={{
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {state?.userTransactionProfile?.loading && <BalanceLoader2 />}
                  <>
                    {' '}
                    &#8358;
                    {state?.userTransactionProfile?.accountBalance?.toLocaleString()}
                  </>{' '}
                  {loadBalance ? (
                    <BalanceLoader2 />
                  ) : (
                    <MdRefresh
                      onClick={fetchUserTransaction}
                      size={20}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </p>
              </div>
            </div>
            {/* <div className={styles.wallet_divider}></div> */}
            <div className={styles.inner_sub}>
              <div className={styles.wallet_logo_container}>
                <BsFillWalletFill className={styles.wallect_balance_icons} />
              </div>
              <div className={styles.wallet_balance}>
                <p>Referral Balance</p>
                <p
                  style={{
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  &#8358; 0.00
                  {loadReferenceBalance ? (
                    <BalanceLoader2 />
                  ) : (
                    <MdRefresh
                      onClick={fetchReferalBalance}
                      size={20}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </p>
              </div>
            </div>
          </div>
          <div id='payments' className={styles.inner_c}>
            <p> Available Payment Methods :</p>
            <p>
              Make payments to this bank account to credit you wallet instantly
              -{' '}
              <span
                style={{
                  color: '#f05822',
                  fontWeight: '500',
                  fontFamily: 'Rubik',
                  fontStyle: 'italic',
                  fontSize: '14px',
                }}
              >
                then refresh wallet balance to see changes
              </span>
            </p>
            <div className={styles.account_details}>
              <div className={styles.account_inner}>
                <p>
                  Account Number:{' '}
                  <span className={styles.pay_details}>
                    {' '}
                    {/* comming soon!{' '}
                  <RiInformationLine className={styles.comming_soon_icon} /> */}
                    {/* ***** */}
                    {!localStorageAccountDetails && '*****'}
                    {localStorageAccountDetails?.accountNumber}
                  </span>
                </p>
                {/* <p>211092938</p> */}
              </div>
              <div className={styles.account_inner}>
                <p>
                  Account Name:{' '}
                  <span className={styles.pay_details}>
                    {' '}
                    {/* comming soon!{' '}
                  <RiInformationLine className={styles.comming_soon_icon} /> */}
                    {!localStorageAccountDetails && '*****'}
                    {localStorageAccountDetails &&
                      `MFY / ${localStorageAccountDetails?.accountName}`}
                  </span>
                </p>
                {/* <p>Kelvin-monnify 12887ba</p> */}
              </div>
              <div className={styles.account_inner}>
                <p>
                  Bank:{' '}
                  <span className={styles.pay_details}>
                    {' '}
                    {/* comming soon!{' '}
                  <RiInformationLine className={styles.comming_soon_icon} /> */}
                    {!localStorageAccountDetails && '*****'}
                    {localStorageAccountDetails?.bankName}
                  </span>
                </p>
                {/* <p>Wema Bank</p> */}
              </div>
            </div>
            {/* <div className={styles.donate_divider_container}>
              <div className={styles.donate_divider} />
              <div className={styles.divider_writeUp}>or</div>
            </div>
            <button onClick={handleModalPopUp} className={styles.btn_wallet}>
              Fund With Card
            </button> */}
          </div>
          <div className={styles.inner_b}>
            <div className={styles.transaction_heading}>
              <p> Notifications</p>
              <p> View all</p>
            </div>
            <h3 style={{ textAlign: 'center', fontWeight: '600' }}>
              No Noifications at the moment
            </h3>
          </div>
          <div className={styles.inner_d}>
            <p> Support Team:</p>
            <p>
              Need to communicate with us? Feel free to reach out to our Support
              Team via Whatsapp.
            </p>

            <button
              onClick={sendWhatsappMessage}
              className={styles.btn_whatsapp}
            >
              <AiOutlineWhatsApp className={styles.whatsapp_icons} />
              WhatsApp us
            </button>
          </div>
        </div>
        <div className={styles.transaction_container}>
          <TransactionTable2 />
        </div>
      </>
    </DashboardLayout>
  );
};

export default UserDashboard;
