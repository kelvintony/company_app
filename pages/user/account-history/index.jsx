import React from 'react';
import DashboardLayout from '../../../components/DashBoardLayout/DashboardLayout';
import styles from './AccountHistory.module.css';
import AccountHistoryTable from '../../../components/AccountHistoryTable/AccountHistoryTable';
const AccountHistory = () => {
  return (
    <DashboardLayout>
      <AccountHistoryTable />
    </DashboardLayout>
  );
};

export default AccountHistory;
