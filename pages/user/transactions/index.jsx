import React from 'react';
import styles from './transaction.module.css';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import { BsJournalRichtext } from 'react-icons/bs';
import MainTransactionTable from '../../../components/TransactionTable/MainTransactionTable';
import NewTransactionTable from '../../../components/TransactionTable/NewTransactionTable';

const CableTv = () => {
  return (
    <DashboardLayout>
      <section className={styles.transaction_container}>
        <MainTransactionTable />
        {/* <NewTransactionTable /> */}
      </section>
    </DashboardLayout>
  );
};

export default CableTv;
