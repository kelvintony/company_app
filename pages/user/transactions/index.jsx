import React from 'react';
import styles from './transaction.module.css';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import { BsJournalRichtext } from 'react-icons/bs';
import MainTransactionTable from '../../../components/TransactionTable/MainTransactionTable';

const CableTv = () => {
  return (
    <DashboardLayout>
      {/* <h3 className={styles.header}>
        Transactions
        <BsJournalRichtext className={styles.comming_soon_icon} />
      </h3> */}
      <section className={styles.transaction_container}>
        <MainTransactionTable />
      </section>
    </DashboardLayout>
  );
};

export default CableTv;
