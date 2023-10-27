import React from 'react';
import styles from './transaction.module.css';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import UsersTab from '../../../components/UsersTab/UsersTab';

const CableTv = () => {
  return (
    <DashboardLayout>
      <section
        style={{ marginTop: '30px' }}
        className={styles.transaction_container}
      >
        <UsersTab />
      </section>
    </DashboardLayout>
  );
};

export default CableTv;
