import React from 'react';
import styles from './deposit.module.css';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import { RiLuggageDepositLine } from 'react-icons/ri';
import { BiCopy } from 'react-icons/bi';

const Deposit = () => {
  return (
    <DashboardLayout>
      <h3 className={styles.header}>
        Make Deposit
        <RiLuggageDepositLine className={styles.comming_soon_icon} />
      </h3>

      <section className={styles.desposit_container}>
        <p>
          Your wallet is credited automatically when you make payment to this
          wallet address
        </p>
        <p>
          USDT (TRC-20) - <span>1TFBbqZHks9XKqDLCF3C0Lo2Hje6QCQNwS5</span>
        </p>
        <button className={styles.btn_copy}>
          Copy <BiCopy />
        </button>
      </section>
    </DashboardLayout>
  );
};

export default Deposit;
