import React from 'react';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import styles from './AccountHistory.module.css';
const AccountHistory = () => {
  return (
    <DashboardLayout>
      <h3 className={styles.header}>Welcome to account history</h3>
    </DashboardLayout>
  );
};

export default AccountHistory;
