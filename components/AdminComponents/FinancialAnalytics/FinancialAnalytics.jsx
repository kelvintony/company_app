import React, { useEffect, useState } from 'react';
import styles from './FinancialAnalytics.module.css';
import Image from 'next/image';
import { BsGraphUpArrow } from 'react-icons/bs';
import axios from 'axios';

const FinancialAnalytics = () => {
  const [accountStatement, setAccountStatement] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccountStatements();
  }, []);

  const fetchAccountStatements = async () => {
    setLoading(true);
    await axios
      .get(`/api/admin/account-statement`)
      .then((res) => {
        setAccountStatement(res?.data?.message[0]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <div className={styles.finance_container}>
      <h3>Financial Analytics</h3>
      <div className={styles.inner_wrapper}>
        <div className={`${styles.account_container} ${styles.panel1}`}>
          <div className={styles.icon_container}>
            <BsGraphUpArrow className={styles.amount_icon} />
          </div>
          <div className={styles.inner}>
            <p>
              Total Received <br />
              <span>
                &#36;{accountStatement?.totalAmountReceivedAfterFee.toFixed(2)}{' '}
                | &#36;
                {accountStatement?.totalAmountReceived}
              </span>
            </p>
          </div>
        </div>
        <div className={`${styles.account_container} ${styles.panel2}`}>
          <div className={styles.icon_container}>
            <BsGraphUpArrow className={styles.amount_icon} />
          </div>
          <div className={styles.inner}>
            <p>
              Total Paid Out <br />
              <span>&#36;{accountStatement?.totalAmountPaidOut}</span>
            </p>
          </div>
        </div>
        <div className={`${styles.account_container} ${styles.panel3}`}>
          <div className={styles.icon_container}>
            <BsGraphUpArrow className={styles.amount_icon} />
          </div>
          <div className={styles.inner}>
            <p>
              Profit <br />
              <span>
                &#36;
                {accountStatement?.totalAmountReceivedAfterFee -
                  accountStatement?.totalAmountPaidOut}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
