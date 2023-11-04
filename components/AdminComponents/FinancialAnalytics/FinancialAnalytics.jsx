import React, { useEffect, useState } from 'react';
import styles from './FinancialAnalytics.module.css';
import Image from 'next/image';
import { BsGraphUpArrow } from 'react-icons/bs';
import axios from 'axios';
import { useSpring, animated } from 'react-spring';

const Number = ({ n }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return <animated.span>{number.to((n) => n.toFixed(2))}</animated.span>;
};
const FinancialAnalytics = () => {
  const [accountStatement, setAccountStatement] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccountStatements();
  }, []);

  const fetchAccountStatements = async () => {
    // setLoading(true);
    await axios
      .get(`/api/admin/account-statement`)
      .then((res) => {
        setAccountStatement(res?.data?.message);
        // setLoading(false);
      })
      .catch((err) => {
        // setLoading(false);
        console.log(err);
      });
  };
  return (
    <div className={styles.finance_container}>
      <h3 onClick={fetchAccountStatements}>Financial Analytics</h3>
      <div className={styles.inner_wrapper}>
        <div className={`${styles.account_container} ${styles.panel1}`}>
          <div className={styles.icon_container}>
            <BsGraphUpArrow className={styles.amount_icon} />
          </div>
          <div className={styles.inner}>
            <p>
              Total Received <br />
              <span>
                &#36;
                <Number
                  n={accountStatement?.totalAmountReceivedAfterFee}
                />{' '}
                <span style={{ color: 'red' }}>|</span> &#36;
                <Number n={accountStatement?.totalAmountReceived} />
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
              <span>
                &#36;
                <Number n={accountStatement?.totalAmountPaidOut} />
              </span>
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
                <Number n={accountStatement?.totalProfit} />
                {/* {Math.round(
                  (accountStatement?.totalAmountReceivedAfterFee -
                    accountStatement?.totalAmountPaidOut) *
                    100
                ) / 100} */}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
